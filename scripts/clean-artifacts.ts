import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';

const BLOG_DIR = path.resolve(import.meta.dir, '../src/content/blog');

function cleanMarkdownBody(body: string): string {
  let cleaned = body;

  // 1. Remove WordPress gallery shortcodes like [gallery type="rectangular" ids="..."]
  cleaned = cleaned.replace(/\[gallery[^\]]*\]/gi, '');

  // 2. Remove WordPress caption shortcodes [caption ...]...[/caption]
  cleaned = cleaned.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, '$1');

  // 3. Remove other leftover WP shortcodes like [embed], [video], etc.
  cleaned = cleaned.replace(/\[\/?(embed|wp_[\w]+|cs_[\w]+|x_[\w]+)[^\]]*\]/gi, '');

  // 4. Upgrade insecure HTTP image and asset links to HTTPS
  cleaned = cleaned.replace(/http:\/\/amirhameed\.com\/wp-content\/uploads\//gi, 'https://amirhameed.com/wp-content/uploads/');
  cleaned = cleaned.replace(/http:\/\/i0\.wp\.com\//gi, 'https://i0.wp.com/');

  // 5. Clean up messy query strings from image URLs (like ?resize=...&#038;ssl=1)
  cleaned = cleaned.replace(/(\.(?:png|jpg|jpeg|gif|webp|svg))\?[^"'\s\)]+/gi, '$1');

  // 6. Clean Gutenberg comments if any exist: <!-- wp:... --> and <!-- /wp:... -->
  cleaned = cleaned.replace(/<!--\s*\/?wp:[^>]*-->/gi, '');

  // 7. Clean broken HTML entity escapes
  cleaned = cleaned
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');

  // 8. Collapse 3+ consecutive newlines into 2
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}

function cleanExcerptText(text: string, body?: string): string {
  let clean = (text || '')
    .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/^[>\s\(\)\!\,\.\:\-]+/g, '')
    .replace(/[*_#`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If text is too short or malformed, extract first readable sentence from body
  if (clean.length < 20 && body) {
    const bodyClean = body
      .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/^[>\s\(\)\!\,\.\:\-]+/g, '')
      .replace(/[*_#`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (bodyClean.length >= 20) {
      clean = bodyClean;
    }
  }

  return clean.slice(0, 160).trim();
}

function run() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  console.log(`🧹 Scanning and cleaning ${files.length} blog posts...`);

  let modifiedCount = 0;

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split frontmatter and body
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) continue;

    const rawYaml = match[1];
    let body = match[2];

    let frontmatter: any = {};
    try {
      frontmatter = yamlLoad(rawYaml) || {};
    } catch {
      continue;
    }

    // Clean body first
    const cleanedBody = cleanMarkdownBody(body);

    // Clean description in frontmatter
    if (frontmatter.description) {
      frontmatter.description = cleanExcerptText(frontmatter.description, cleanedBody);
    }

    // Clean heroImage URL
    if (frontmatter.heroImage) {
      frontmatter.heroImage = frontmatter.heroImage
        .replace(/^http:\/\//i, 'https://')
        .replace(/(\.(?:png|jpg|jpeg|gif|webp|svg))\?[^"'\s]+/gi, '$1');
    }



    // If description is empty, fallback to first clean sentence of body
    if (!frontmatter.description && cleanedBody) {
      frontmatter.description = cleanExcerptText(cleanedBody).slice(0, 160);
    }

    const newContent = `---\n${yamlDump(frontmatter)}---\n\n${cleanedBody}\n`;

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      modifiedCount++;
    }
  }

  console.log(`✨ Successfully cleaned WordPress artifacts from ${modifiedCount} files!`);
}

run();

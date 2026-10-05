import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';

const XML_PATH = 'C:\\Users\\amir\\Downloads\\amirhameed.WordPress.2026-09-26.xml';
const BLOG_DIR = path.resolve(import.meta.dir, '../src/content/blog');
const PROJECTS_DIR = path.resolve(import.meta.dir, '../src/content/projects');

function cleanHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}

function extractString(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (typeof val.__cdata === 'string') return val.__cdata;
    if (typeof val['#text'] === 'string') return val['#text'];
    return '';
  }
  return String(val);
}

// 1. Build attachment map from XML
const attachmentMap = new Map<string, string>();
if (fs.existsSync(XML_PATH)) {
  console.log(`📖 Parsing XML to index attachment IDs...`);
  const xmlContent = fs.readFileSync(XML_PATH, 'utf-8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    parseTagValue: false,
  });
  const parsed = parser.parse(xmlContent);
  const items = parsed?.rss?.channel?.item;

  if (Array.isArray(items)) {
    for (const item of items) {
      const postType = extractString(item['wp:post_type']);
      const postId = extractString(item['wp:post_id']);
      let attachmentUrl = extractString(item['wp:attachment_url']);

      if (postType === 'attachment' && postId && attachmentUrl) {
        attachmentMap.set(postId, attachmentUrl);
      }
    }
  }
  console.log(`📸 Indexed ${attachmentMap.size} media attachments.`);
}

function cleanShortcodes(text: string): string {
  let res = text;

  // Unescape backslash-escaped shortcodes like \[cs_content\] -> [cs_content]
  res = res.replace(/\\\[/g, '[').replace(/\\\]/g, ']');

  // Handle [gallery ids="1,2,3"] -> real markdown images
  res = res.replace(/\[gallery[^\]]*ids="([^"]+)"[^\]]*\]/gi, (_match, idsStr) => {
    const ids = idsStr.split(',').map((id: string) => id.trim()).filter(Boolean);
    const images: string[] = [];
    for (const id of ids) {
      const url = attachmentMap.get(id);
      if (url) {
        // Convert to local path /wp-content/uploads/... so when user pastes uploads, it loads seamlessly
        const localPath = url.replace(/^https?:\/\/amirhameed\.com\//i, '/');
        images.push(`![Photo](${localPath})`);
      }
    }
    return images.length > 0 ? '\n\n' + images.join('\n\n') + '\n\n' : '';
  });

  // Handle [button href="URL" ...]Label[/button] -> [Label](URL)
  res = res.replace(/\[(?:x_)?button[^\]]*href=["']([^"']+)["'][^\]]*\]([\s\S]*?)\[\/(?:x_)?button\]/gi, (_m, href, label) => {
    const cleanLabel = label.replace(/\[[^\]]+\]/g, '').trim() || 'Learn More';
    return `\n\n[${cleanLabel}](${href})\n\n`;
  });

  // Handle standalone buttons without closing tag [button href="URL" ...]
  res = res.replace(/\[(?:x_)?button[^\]]*href=["']([^"']+)["'][^\]]*\]/gi, (_m, href) => {
    return `\n\n[View Resource](${href})\n\n`;
  });

  // Handle [blockquote ...]Text[/blockquote] -> > Text
  res = res.replace(/\[blockquote[^\]]*\]([\s\S]*?)\[\/blockquote\]/gi, (_m, inner) => {
    const lines = inner.trim().split('\n');
    return '\n\n' + lines.map((l: string) => `> ${l.trim()}`).join('\n') + '\n\n';
  });

  // Handle [cs_text]Text[/cs_text] -> Text
  res = res.replace(/\[cs_text\]([\s\S]*?)\[\/cs_text\]/gi, '$1\n\n');

  // Strip layout wrapper tags like [cs_content], [cs_section...], [cs_row...], [cs_column...]
  res = res.replace(/\[\/?(?:cs_content|cs_section|cs_row|cs_column|x_icon|x_button|x_section|x_row|x_column|title)[^\]]*\]/gi, '');

  // Strip any remaining WordPress shortcodes
  res = res.replace(/\[\/?(?:caption|embed|gallery|blockquote|vc_\w+|wp_\w+)[^\]]*\]/gi, '');

  // Fix malformed image syntax !(/url) -> ![Photo](/url)
  res = res.replace(/!\(([^)]+)\)/g, '![Photo]($1)');

  // Clean remaining escaped brackets and excessive whitespace
  res = res.replace(/\\{2,}/g, '').replace(/^\s*\\\s*$/gm, '');
  res = res.replace(/\n{3,}/g, '\n\n').trim();

  return res;
}

function cleanExcerpt(excerpt: string, title: string, bodyText: string, category?: string): string {
  let clean = excerpt || '';
  clean = clean.replace(/\\\[/g, '[').replace(/\\\]/g, ']');
  clean = clean.replace(/\[[^\]]*\]/g, ' '); // Strip bracketed shortcodes
  clean = clean.replace(/!\[.*?\]\(.*?\)/g, ' '); // Strip markdown images
  clean = clean.replace(/!\(.*?\)/g, ' '); // Strip broken images
  clean = clean.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Strip markdown links
  clean = clean.replace(/https?:\/\/[^\s]+/g, ' ');
  clean = clean.replace(/\/wp-content\/uploads\/[^\s\)]+/g, ' ');
  clean = clean.replace(/[*_#`~\\>]/g, ' ');
  clean = clean.replace(/\s+/g, ' ').trim();

  // If contaminated with shortcodes, CSS styles or empty
  const isCorrupted = !clean || 
    clean.length < 20 || 
    clean.includes('[') || 
    clean.includes(']') || 
    clean.includes('marginless') || 
    clean.includes('padding') || 
    clean.includes('style=') ||
    clean.includes('cscontent') ||
    clean.includes('csrow') ||
    clean.includes('cssection') ||
    clean.includes('gallery');

  if (isCorrupted) {
    const cleanBody = bodyText
      .replace(/!\[.*?\]\(.*?\)/g, ' ')
      .replace(/!\(.*?\)/g, ' ')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/https?:\/\/[^\s]+/g, ' ')
      .replace(/\/wp-content\/uploads\/[^\s\)]+/g, ' ')
      .replace(/[*_#`~\\>]/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanBody.length >= 25 && !cleanBody.includes('marginless') && !cleanBody.includes('padding:')) {
      clean = cleanBody.slice(0, 160);
    } else {
      clean = `${title} — ${category ? `${category} work` : 'Article & insights'} by Amir Hameed.`;
    }
  }

  return clean.slice(0, 160).trim();
}

function processDirectory(dir: string, isProject: boolean) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  console.log(`\n🔍 Processing ${files.length} files in ${path.basename(dir)}...`);
  let cleaned = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

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

    const title = frontmatter.title || file.replace('.md', '');
    const category = frontmatter.category || (Array.isArray(frontmatter.categories) ? frontmatter.categories[0] : '');
    const cleanedBody = cleanShortcodes(body);
    const newDescription = cleanExcerpt(frontmatter.description, title, cleanedBody, category);

    frontmatter.description = newDescription;

    // Convert heroImage to local path if it is amirhameed.com
    if (frontmatter.heroImage && typeof frontmatter.heroImage === 'string') {
      frontmatter.heroImage = frontmatter.heroImage.replace(/^https?:\/\/amirhameed\.com\//i, '/');
    }

    const newContent = `---\n${yamlDump(frontmatter, { lineWidth: -1 })}---\n\n${cleanedBody}\n`;

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      cleaned++;
    }
  }

  console.log(`✅ Cleaned ${cleaned} files in ${path.basename(dir)}`);
}

processDirectory(PROJECTS_DIR, true);
processDirectory(BLOG_DIR, false);
console.log(`\n🎉 All WordPress shortcodes cleaned and galleries mapped successfully!`);

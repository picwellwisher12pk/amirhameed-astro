import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { dump as yamlDump } from 'js-yaml';

const XML_PATH = 'C:\\Users\\amir\\Downloads\\amirhameed.WordPress.2026-09-26.xml';
const BLOG_DIR = path.resolve(import.meta.dir, '../src/content/blog');

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

turndown.remove(['script', 'style']);

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

function isUrduText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function run() {
  if (!fs.existsSync(XML_PATH)) {
    console.error(`❌ XML file not found at: ${XML_PATH}`);
    return;
  }

  console.log(`📖 Reading XML file: ${XML_PATH}...`);
  const xmlContent = fs.readFileSync(XML_PATH, 'utf-8');

  console.log(`⚙️  Parsing XML structure...`);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    parseTagValue: false,
  });

  const parsed = parser.parse(xmlContent);
  const items = parsed?.rss?.channel?.item;

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

  console.log(`Found ${items.length} total items in XML export.`);

  // 1. Build attachments map (ID -> URL)
  const attachmentMap = new Map<string, string>();
  for (const item of items) {
    const postType = item['wp:post_type']?.['__cdata'] || item['wp:post_type'];
    const postId = String(item['wp:post_id']?.['__cdata'] || item['wp:post_id']);
    const attachmentUrl = item['wp:attachment_url']?.['__cdata'] || item['wp:attachment_url'];

    if (postType === 'attachment' && postId && attachmentUrl) {
      attachmentMap.set(postId, attachmentUrl);
    }
  }
  console.log(`📸 Indexed ${attachmentMap.size} media attachments.`);

  // 2. Process published blog posts
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  let importedPosts = 0;
  let urduPosts = 0;
  let englishPosts = 0;

  for (const item of items) {
    const postType = item['wp:post_type']?.['__cdata'] || item['wp:post_type'];
    const status = item['wp:status']?.['__cdata'] || item['wp:status'];

    if (postType !== 'post' || status !== 'publish') {
      continue;
    }

    const postId = item['wp:post_id']?.['__cdata'] || item['wp:post_id'];
    const rawTitle = item.title?.['__cdata'] || item.title || `Post ${postId}`;
    const cleanTitle = cleanHtmlEntities(rawTitle).trim();

    let rawSlug = item['wp:post_name']?.['__cdata'] || item['wp:post_name'] || `post-${postId}`;
    let slug = decodeURIComponent(rawSlug).replace(/[^\w\s\u0600-\u06FF-]/g, '').trim().replace(/\s+/g, '-');
    if (!slug) slug = `post-${postId}`;

    const date = item['wp:post_date']?.['__cdata'] || item['wp:post_date'] || item.pubDate || new Date().toISOString();
    const cleanDate = date.split(' ')[0] || new Date().toISOString().split('T')[0];

    const rawContent = extractString(item['content:encoded']);
    const rawExcerpt = extractString(item['excerpt:encoded']);

    // Extract categories and tags
    const categories: string[] = [];
    const tags: string[] = [];
    const catEntries = item.category;

    if (Array.isArray(catEntries)) {
      for (const c of catEntries) {
        const domain = c['@_domain'];
        const name = cleanHtmlEntities(c['__cdata'] || c['#text'] || '');
        if (domain === 'category' && name && !categories.includes(name)) {
          categories.push(name);
        } else if (domain === 'post_tag' && name && !tags.includes(name)) {
          tags.push(name);
        }
      }
    } else if (catEntries && typeof catEntries === 'object') {
      const domain = catEntries['@_domain'];
      const name = cleanHtmlEntities(catEntries['__cdata'] || catEntries['#text'] || '');
      if (domain === 'category' && name) categories.push(name);
      if (domain === 'post_tag' && name) tags.push(name);
    }

    if (categories.length === 0) categories.push('General');

    // Extract featured image from postmeta
    let heroImage = '';
    const postmeta = item['wp:postmeta'];
    if (Array.isArray(postmeta)) {
      for (const meta of postmeta) {
        const key = meta['wp:meta_key']?.['__cdata'] || meta['wp:meta_key'];
        const val = String(meta['wp:meta_value']?.['__cdata'] || meta['wp:meta_value']);
        if (key === '_thumbnail_id' && attachmentMap.has(val)) {
          heroImage = attachmentMap.get(val) || '';
          break;
        }
      }
    }

    // Detect language
    const isUrdu = isUrduText(cleanTitle) || isUrduText(rawContent.slice(0, 500));
    const language = isUrdu ? 'ur' : 'en';
    if (isUrdu) urduPosts++; else englishPosts++;

    // Convert [gallery ... ids="1,2,3"] shortcodes into real image markdown
    let processedContent = rawContent.replace(/\[gallery[^\]]*ids="([^"]+)"[^\]]*\]/gi, (_match, idsStr) => {
      const ids = idsStr.split(',').map((id: string) => id.trim()).filter(Boolean);
      const images = ids
        .map((id: string) => attachmentMap.get(id))
        .filter(Boolean);

      if (images.length === 0) return '';
      return '\n\n' + images.map((url: string) => `![Photo](${url})`).join('\n\n') + '\n\n';
    });

    // Strip any remaining unparsed shortcodes
    processedContent = processedContent.replace(/\[\/?(?:gallery|caption|embed|wp_[\w]+)[^\]]*\]/gi, '');

    // Convert HTML to Markdown
    let markdown = turndown.turndown(processedContent);

    // Clean up any escaped shortcode remnants and stray backslashes
    markdown = markdown
      .replace(/\\\[gallery[^\]]*\\\]/gi, '')
      .replace(/\\{2,}/g, '')
      .replace(/^\s*\\\s*$/gm, '')
      .trim();

    // Clean excerpt for SEO description
    let cleanExcerpt = cleanHtmlEntities(turndown.turndown(rawExcerpt)).replace(/\n+/g, ' ').trim();
    if (!cleanExcerpt || cleanExcerpt.includes('gallery') || cleanExcerpt.length < 20) {
      const cleanBodyText = markdown
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/[*_#`~\\>]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanBodyText.length >= 20) {
        cleanExcerpt = cleanBodyText;
      } else {
        cleanExcerpt = `Memories and photos from ${cleanTitle}.`;
      }
    }
    cleanExcerpt = cleanExcerpt.slice(0, 160).trim();

    const frontmatterObj: Record<string, any> = {
      title: cleanTitle,
      description: cleanExcerpt,
      pubDate: cleanDate,
      categories,
      tags,
      language,
    };
    if (heroImage) frontmatterObj.heroImage = heroImage;

    const fileContent = `---\n${yamlDump(frontmatterObj)}---\n\n${markdown}\n`;

    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    importedPosts++;
  }

  console.log(`\n🎉 XML Import Complete!`);
  console.log(`📝 Total Published Posts: ${importedPosts}`);
  console.log(`   - 🇵🇰 Urdu Posts: ${urduPosts}`);
  console.log(`   - 🇬🇧 English Posts: ${englishPosts}`);
  console.log(`📁 Destination: ${BLOG_DIR}\n`);
}

run();

import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { dump as yamlDump } from 'js-yaml';

const XML_PATH = 'C:\\Users\\amir\\Downloads\\amirhameed.WordPress.2026-09-26.xml';
const PROJECTS_DIR = path.resolve(import.meta.dir, '../src/content/projects');

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

export function importDesignProjects() {
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

  if (!Array.isArray(items)) {
    console.error('❌ Could not parse items from XML.');
    return;
  }

  // 1. Build attachments map (ID -> URL)
  const attachmentMap = new Map<string, string>();
  for (const item of items) {
    const postType = extractString(item['wp:post_type']);
    const postId = extractString(item['wp:post_id']);
    const attachmentUrl = extractString(item['wp:attachment_url']);

    if (postType === 'attachment' && postId && attachmentUrl) {
      attachmentMap.set(postId, attachmentUrl);
    }
  }
  console.log(`📸 Indexed ${attachmentMap.size} media attachments.`);

  // 2. Filter x-portfolio published items
  const portfolioItems = items.filter((item) => {
    const postType = extractString(item['wp:post_type']);
    const status = extractString(item['wp:status']);
    return postType === 'x-portfolio' && status === 'publish';
  });

  console.log(`🎨 Found ${portfolioItems.length} published design portfolio projects.`);

  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }

  let imported = 0;

  for (const item of portfolioItems) {
    const postId = extractString(item['wp:post_id']);
    const rawTitle = extractString(item.title) || `Project ${postId}`;
    const cleanTitle = cleanHtmlEntities(rawTitle).trim();

    let rawSlug = extractString(item['wp:post_name']) || `project-${postId}`;
    let slug = decodeURIComponent(rawSlug).replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase();
    if (!slug) slug = `project-${postId}`;

    const date = extractString(item['wp:post_date']) || extractString(item.pubDate) || new Date().toISOString();
    const cleanDate = date.split(' ')[0] || new Date().toISOString().split('T')[0];

    const rawContent = extractString(item['content:encoded']);
    const rawExcerpt = extractString(item['excerpt:encoded']);

    // Extract categories & tags
    const categories: string[] = [];
    const tags: string[] = ['Design'];
    const catEntries = item.category;

    if (Array.isArray(catEntries)) {
      for (const c of catEntries) {
        const name = cleanHtmlEntities(extractString(c)).trim();
        if (name && !categories.includes(name)) {
          categories.push(name);
        }
      }
    } else if (catEntries) {
      const name = cleanHtmlEntities(extractString(catEntries)).trim();
      if (name) categories.push(name);
    }

    const primaryCategory = categories[0] || 'Design & Creative';
    for (const c of categories) {
      if (!tags.includes(c)) tags.push(c);
    }

    // Extract hero image
    let heroImage = '';
    const postmeta = item['wp:postmeta'];
    if (Array.isArray(postmeta)) {
      const thumb = postmeta.find((m) => extractString(m['wp:meta_key']) === '_thumbnail_id');
      if (thumb) {
        const thumbId = extractString(thumb['wp:meta_value']);
        if (thumbId && attachmentMap.has(thumbId)) {
          heroImage = attachmentMap.get(thumbId)!;
        }
      }
    }

    // Convert content to Markdown
    let markdownBody = '';
    if (rawContent && rawContent.trim()) {
      markdownBody = turndown.turndown(rawContent).trim();
    }

    // Generate meaningful description
    let description = '';
    if (rawExcerpt && rawExcerpt.trim()) {
      description = cleanHtmlEntities(rawExcerpt.replace(/<[^>]+>/g, '')).trim();
    }
    if (!description && markdownBody) {
      const firstLine = markdownBody.split('\n').find((l) => l.trim().length > 10 && !l.startsWith('#') && !l.startsWith('!'));
      if (firstLine) {
        description = firstLine.substring(0, 160).trim();
      }
    }
    if (!description) {
      description = `${cleanTitle} — ${primaryCategory} project by Amir Hameed.`;
    }

    if (!markdownBody) {
      markdownBody = `### Overview\n${description}\n\n${heroImage ? `![${cleanTitle}](${heroImage})\n` : ''}`;
    }

    const frontmatter: Record<string, any> = {
      title: cleanTitle,
      description: description,
      pubDate: cleanDate,
      category: primaryCategory,
      tags: tags,
      status: 'completed',
    };

    if (heroImage) {
      frontmatter.heroImage = heroImage;
    }

    const fileContent = `---\n${yamlDump(frontmatter, { lineWidth: -1 })}---\n\n${markdownBody}\n`;
    const filePath = path.join(PROJECTS_DIR, `${slug}.md`);

    fs.writeFileSync(filePath, fileContent, 'utf-8');
    imported++;
  }

  console.log(`✅ Successfully imported ${imported} design projects into ${PROJECTS_DIR}`);
}

if (import.meta.main) {
  importDesignProjects();
}

import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Remove script and style tags
turndown.remove(['script', 'style']);

const BASE_URL = 'https://amirhameed.com/wp-json/wp/v2';
const BLOG_DIR = path.resolve(import.meta.dir, '../src/content/blog');

function cleanHtmlEntities(str: string): string {
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"');
}

function isUrduText(text: string): boolean {
  // Regex to detect Arabic/Urdu Unicode range
  return /[\u0600-\u06FF]/.test(text);
}

async function fetchCategories(): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  try {
    const res = await fetch(`${BASE_URL}/categories?per_page=100`);
    if (res.ok) {
      const data = await res.json();
      for (const cat of data) {
        map.set(cat.id, cat.name);
      }
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
  return map;
}

async function run() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  const args = process.argv.slice(2);
  const limitArgIndex = args.indexOf('--limit');
  const limit = limitArgIndex !== -1 ? parseInt(args[limitArgIndex + 1], 10) : 10;
  const isAll = args.includes('--all');

  console.log(`📡 Fetching categories from ${BASE_URL}...`);
  const categoryMap = await fetchCategories();

  console.log(`📥 Fetching posts (Mode: ${isAll ? 'ALL' : `First ${limit}`} posts)...`);

  let page = 1;
  let importedCount = 0;
  let hasMore = true;

  while (hasMore) {
    const perPage = isAll ? 100 : Math.min(limit - importedCount, 100);
    const url = `${BASE_URL}/posts?per_page=${perPage}&page=${page}&_embed`;

    console.log(`Fetching page ${page}... (${url})`);
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 400) {
        // Exceeded available pages
        break;
      }
      console.error(`Error fetching page ${page}: ${res.statusText}`);
      break;
    }

    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      break;
    }

    for (const post of posts) {
      const rawTitle = post.title?.rendered || 'Untitled';
      const cleanTitle = cleanHtmlEntities(rawTitle).trim();
      const rawSlug = post.slug || `post-${post.id}`;
      let slug = decodeURIComponent(rawSlug).replace(/[^\w\s\u0600-\u06FF-]/g, '').trim().replace(/\s+/g, '-');
      if (!slug) slug = `post-${post.id}`;
      const date = post.date || new Date().toISOString();
      const rawContent = post.content?.rendered || '';

      // Extract categories
      const postCategories: string[] = (post.categories || [])
        .map((id: number) => categoryMap.get(id) || 'General')
        .filter(Boolean);

      // Featured image
      let heroImage = '';
      if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
        heroImage = post._embedded['wp:featuredmedia'][0].source_url;
      }

      // Detect language
      const language = isUrduText(cleanTitle) ? 'ur' : 'en';

      // Convert HTML content to Markdown
      let markdownContent = turndown.turndown(rawContent);

      // Create excerpt / description
      const rawExcerpt = post.excerpt?.rendered ? turndown.turndown(post.excerpt.rendered) : '';
      const cleanExcerpt = cleanHtmlEntities(rawExcerpt).replace(/\n+/g, ' ').trim().slice(0, 160);

      // Generate frontmatter
      const fileContent = `---
title: "${cleanTitle.replace(/"/g, '\\"')}"
description: "${cleanExcerpt.replace(/"/g, '\\"')}"
pubDate: ${date.split('T')[0]}
categories: ${JSON.stringify(postCategories)}
tags: []
heroImage: "${heroImage}"
language: "${language}"
---

${markdownContent}
`;

      const targetPath = path.join(BLOG_DIR, `${slug}.md`);
      fs.writeFileSync(targetPath, fileContent, 'utf-8');
      importedCount++;
      console.log(`✔ Imported: ${cleanTitle} (${language.toUpperCase()}) -> ${slug}.md`);

      if (!isAll && importedCount >= limit) {
        hasMore = false;
        break;
      }
    }

    const totalPagesHeader = res.headers.get('x-wp-totalpages');
    const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
    if (page >= totalPages || !hasMore) {
      break;
    }
    page++;
  }

  console.log(`\n🎉 Done! Successfully imported ${importedCount} posts into ${BLOG_DIR}`);
}

run().catch(console.error);

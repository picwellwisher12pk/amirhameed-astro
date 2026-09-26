import fs from 'node:fs';
import path from 'node:path';

const PROJECTS_DIR = path.resolve(import.meta.dir, '../src/content/projects');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getArg(flag: string): string | undefined {
  const args = process.argv.slice(2);
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return undefined;
}

function run() {
  const args = process.argv.slice(2);
  const title = args.find((a) => !a.startsWith('--')) || 'Untitled Innovation';
  const category = getArg('--category') || 'AI & Automation';
  const tagsStr = getArg('--tags') || 'TypeScript,Next.js,AI';
  const demoUrl = getArg('--demo') || '';
  const repoUrl = getArg('--repo') || '';
  const description = getArg('--desc') || 'A modern intelligent system built with cutting-edge technologies.';
  const featured = args.includes('--featured');
  const status = getArg('--status') || 'completed';

  const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
  const slug = slugify(title);

  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }

  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);

  const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
pubDate: ${new Date().toISOString().split('T')[0]}
category: "${category}"
tags: ${JSON.stringify(tags)}
featured: ${featured}
status: "${status}"${demoUrl ? `\ndemoUrl: "${demoUrl}"` : ''}${repoUrl ? `\nrepoUrl: "${repoUrl}"` : ''}
---

### Overview
Describe what this project is, what problem it solves, and why you created it.

### Key Architecture & Features
- **Feature 1**: High-performance execution.
- **Feature 2**: Clean developer experience.
- **Feature 3**: Scalable modular architecture.

### Technologies Used
${tags.map((t) => `- ${t}`).join('\n')}
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`\n✨ Successfully created new project!`);
  console.log(`📁 File: ${filePath}`);
  console.log(`🔗 Slug: ${slug}\n`);
}

run();

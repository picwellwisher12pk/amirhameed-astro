# AI Agent Instructions for amirhameed.com

This repository is Amir Hameed's personal website and portfolio built with **Astro 7**, **Tailwind CSS v4**, and **Bun**.

## How to Add a New Project (Agent Workflow)

Whenever Amir asks to add a new project or idea to the website:

1. **Create a Markdown File** in `src/content/projects/<slug>.md`.
2. **Schema & Frontmatter**:
   ```markdown
   ---
   title: "Project Name"
   description: "One or two sentence summary of the project."
   pubDate: YYYY-MM-DD
   category: "AI & Automation" # Options: AI & Automation, Web Development, Cloud Computing, UI/UX & Design, Tools & Automation
   tags: ["React", "FastAPI", "Tailwind"]
   featured: true # Set true if this should appear on the homepage
   status: "completed" # completed | in-progress | concept
   demoUrl: "https://demo.example.com" # optional
   repoUrl: "https://github.com/amirhameed/repo" # optional
   heroImage: "/images/projects/preview.png" # optional, placed in public/
   ---

   ### Overview
   What the project does and why it was built.

   ### Key Features & Architecture
   - Feature 1
   - Feature 2

   ### Tech Stack & Learnings
   - Details about implementation.
   ```
3. **Verify Build**:
   Run `bun run build` to verify there are no schema validation errors.

---

## How to Add or Import Blog Posts

1. **Individual Post**: Create a markdown file in `src/content/blog/<slug>.md`.
2. **Bulk WordPress Sync**:
   Run `bun run import-wp --limit 20` or `bun run import-wp --all` to fetch and convert WordPress posts.

---

## Commands
- `bun run dev` &rarr; Start dev server at http://localhost:3000
- `bun run build` &rarr; Build production static bundle in `dist/`
- `bun run new-project` &rarr; Scaffold a new project from CLI

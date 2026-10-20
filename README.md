# 🌐 amirhameed.com — Personal Portfolio & Engineering Showcase

**The official personal website and digital portfolio of Amir Hameed — Principal Software Engineer, UI/UX Architect, and Systems Builder.**

Built with **Astro 7**, **Tailwind CSS v4**, **Bun**, and dynamic multi-theme architecture.

🌐 **Production Website**: [https://amirhameed.com](https://amirhameed.com)

---

## 🌟 Highlights

- **⚡ Blazing Fast Architecture**: Zero-JS baseline static site generation powered by **Astro 7** and native Vite bundling.
- **🎨 Dynamic Multi-Theme System**:
  - **Aurora Minimalist**: Sleek emerald and cyan glow accents against an ultra-dark background.
  - **Luxury Classical**: Rich gold and bronze accents, serif editorial typography, and parchment cards.
  - Seamless, flicker-free theme persistence using inline script execution and localStorage.
- **📚 Rich Content Collections**:
  - Strongly typed schemas for Blog Posts, Case Studies, and Software Projects using `astro:content`.
  - Automated WordPress archive importer (`scripts/import-wp.ts`) parsing XML feeds and Turndown markdown conversion.
  - Interactive Project CLI (`scripts/new-project.ts`) for scaffolding standardized metadata.
- **🔍 Full-Featured Showcase**:
  - Interactive portfolio categories: AI & Automation, Developer Tools, Desktop Applications, Islamic Informatics, and UI/UX Systems.
  - Direct download links, live demos, and GitHub repository source integration.

---

## 🏗️ Project Structure

```
amirhameed-astro/
├── public/                 # Static assets, fonts, project images, download binaries
├── scripts/
│   ├── import-wp.ts        # Bulk WordPress XML/REST importer & markdown converter
│   └── new-project.ts      # Interactive CLI for scaffolding project content
├── src/
│   ├── components/         # Reusable Astro & UI components (Nav, Footer, Cards)
│   ├── content/
│   │   ├── blog/           # Technical blog posts & articles
│   │   └── projects/       # Portfolio case studies & project manifests
│   ├── layouts/            # BaseLayout, PostLayout, and ProjectLayout
│   ├── pages/              # File-based routes (Home, Projects, Blog, About, Contact)
│   ├── styles/             # Tailwind CSS v4 directives & theme definitions
│   └── content.config.ts   # Astro 7 Content Collections schemas
└── package.json            # Scripts, dependencies, and engines manifest
```

---

## 🛠️ Tech Stack

- **Core Framework**: [Astro 7](https://astro.build/)
- **CSS Engine**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Icons**: [Lucide Astro](https://lucide.dev/)
- **Markdown & Feed Tools**: Turndown, JS-YAML, Fast-XML-Parser, `@astrojs/rss`, `@astrojs/sitemap`
- **Analytics & Hosting**: [Vercel Analytics](https://vercel.com/analytics), deployed on Vercel Edge Network
- **Package Manager & Runtime**: [Bun](https://bun.sh/)

---

## 🚀 Development & Building

### Prerequisites
- [Bun](https://bun.sh/) (v1.0+)
- Node.js >= 22.12.0 (for hosting environments)

### Installation
```bash
# Clone the repository
git clone https://github.com/picwellwisher12pk/amirhameed-astro.git
cd amirhameed-astro

# Install dependencies
bun install
```

### Commands
```bash
# Start local development server (http://localhost:3000)
bun run dev

# Build production static bundle in dist/
bun run build

# Preview production build locally
bun run preview

# Scaffold a new project via CLI
bun run new-project

# Import WordPress archive articles
bun run import-wp --limit 20
```

---

## 📄 License

All original software, portfolio content, and visual assets © [Amir Hameed](https://amirhameed.com). All rights reserved.

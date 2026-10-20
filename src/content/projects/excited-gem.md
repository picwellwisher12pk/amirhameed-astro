---
heroImage: /images/projects/excited-gem.jpg
title: Excited Gem — Power-User Browser Tab Manager
description: High-performance Chrome MV3 tab management workspace featuring AI semantic search, session clustering, Dnd-Kit reordering, and Tauri desktop integration.
pubDate: '2026-09-19'
category: Browser Extensions & Tools
tags:
  - Plasmo
  - React 18
  - Redux Toolkit
  - Transformers
  - Dnd-Kit
  - Ant Design
  - Tauri
  - Chrome Extension
featured: true
status: completed
demoUrl: https://chrome.google.com/webstore/detail/excited-gem/ndmfbpjadedofeohnpefljloeiekhcbc
downloadUrl: https://chrome.google.com/webstore/detail/excited-gem/ndmfbpjadedofeohnpefljloeiekhcbc
repoUrl: https://github.com/picwellwisher12pk/excited-gem
---

### Store Listing & Repository

- 🛒 **[Chrome Web Store Listing](https://chrome.google.com/webstore/detail/excited-gem/ndmfbpjadedofeohnpefljloeiekhcbc)** — Official published Chrome Web Store extension.
- 💻 **[GitHub Repository](https://github.com/picwellwisher12pk/excited-gem)** — Full extension and companion source code.

---

### Overview

**Excited Gem** (v1.23.0) is a flagship tab management and browser workspace extension engineered for researchers, software engineers, and power users facing severe tab overload. Far surpassing simple tab-dumpers like OneTab, Excited Gem delivers a complete productivity operating environment inside the browser.

Built with **Plasmo**, **React 18**, **Redux Toolkit**, **Ant Design**, and on-device **Xenova Transformers**, Excited Gem reduces browser memory consumption by up to 95% while keeping thousands of links instantly searchable and organized.

---

### Key Architecture & Capabilities

- **⚡ Instant Tab Clustering & Memory Recovery**:
  - Collapse single tabs, active windows, or all open windows into organized, project-scoped collections in a single keystroke.
- **🧠 On-Device Semantic Vector Search**:
  - Uses `@xenova/transformers` to generate client-side embeddings for saved tab titles and page snippets, allowing natural language search queries (*"that rust tauri issue from yesterday"*).
- **🖐️ Fluid Drag-and-Drop Organization**:
  - Powered by `@dnd-kit/core` and `@dnd-kit/sortable` for silky-smooth tab reordering between workspaces, window groups, and pinned clusters.
- **🔄 Robust State & Multi-Window Sync**:
  - Redux Toolkit with `@plasmohq/redux-persist` and custom WebExtension storage adapters ensuring zero state loss across browser crashes and restarts.
- **🖥️ Tauri Desktop Companion Integration**:
  - Optional desktop bridge via Tauri 2 and global keyboard shortcuts to summon tab search from anywhere in your operating system.
- **🎨 Polished Hybrid UI Architecture**:
  - Combines Ant Design's rich data components (`Table`, `Segmented`, `Tree`) with Tailwind CSS fluidity and Framer Motion micro-interactions.

---

### Tech Stack

- **Extension Core**: Plasmo Framework (Manifest V3)
- **Frontend Architecture**: React 18, TypeScript, Redux Toolkit, Redux Persist
- **Interactions & UI**: Ant Design, Tailwind CSS, Framer Motion, `@dnd-kit`
- **AI & ML**: `@xenova/transformers` (Client-side embeddings)
- **Desktop Bridge**: Tauri 2, Global Shortcuts Plugin

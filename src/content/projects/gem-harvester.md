---
heroImage: /images/projects/gem-harvester.jpg
title: Gem Harvester — Autonomous Web Scraping & Workflow Automation Suite
description: Intelligent web scraping & workflow automation suite built on Plasmo, React, Hugging Face Transformers, and Ant Design for AI data harvesting.
pubDate: '2026-08-15'
category: Browser Extensions & Tools
tags:
  - Plasmo
  - React
  - TypeScript
  - Transformers
  - Dexie.js
  - Ant Design
  - DOM Automation
  - Chrome Extension
featured: true
status: completed
repoUrl: https://github.com/picwellwisher12pk/gem-harvester
downloadUrl: /downloads/extensions/gem-harvester-extension.zip
---

### Direct Suite Extension Package & Installation

- ⚡ **[Download Gem Harvester Suite (.zip)](/downloads/extensions/gem-harvester-extension.zip)** — Pre-built production Chromium package (~1.95 MB).
- 💻 **[GitHub Repository](https://github.com/picwellwisher12pk/gem-harvester)** — Extension source code and routine engine.

#### How to install in Chrome / Brave / Edge:
1. Download and extract the `.zip` archive to a folder.
2. In your browser, open `chrome://extensions/`.
3. Enable **Developer mode** in the upper right corner.
4. Click **Load unpacked** and select the extracted folder.

---

### Overview

**Gem Harvester** (v0.9.1) is a specialized browser automation and intelligent data extraction suite engineered for complex web harvesting workflows. Built with **Plasmo**, **React**, **Ant Design**, and in-browser AI models via **`@huggingface/transformers`**, the suite empowers researchers and developers to construct multi-step visual scraping routines, extract structured schemas, clean data on-device with zero API fees, and store records in **Dexie (IndexedDB)**.

---

### Key Architecture & Capabilities

- **🔄 Visual Routine Pipeline Builder**:
  - Construct automated workflows consisting of Navigation, Delay/Wait, Click, Form Input, DOM Extraction, Infinite Scroll, and Conditional Loops.
- **🤖 On-Device AI Entity Extraction**:
  - Leverages client-side `@huggingface/transformers` to classify, extract, and clean unstructured DOM text directly in the browser tab.
- **📊 Adaptive DOM Extraction Engine**:
  - Heuristic pattern detection across HTML tables, dynamic e-commerce card grids, and paginated catalogs with CSS selector overrides.
- **💾 High-Capacity IndexedDB Persistence**:
  - Built-in Dexie.js database engine storing harvested datasets locally without localStorage quota limits.
- **⚡ Instant Multi-Format Export**:
  - One-click dataset export to formatted JSON, clean CSV (via PapaParse), or clipboard.
- **🎨 Polished Ant Design Cockpit**:
  - Native drawer runner with live step-by-step telemetry, execution progress bars, error handling, and dark/light mode sync.

---

### Tech Stack

- **Extension Framework**: Plasmo (Manifest V3)
- **UI Framework**: React 18, TypeScript, Ant Design, Tailwind CSS
- **AI & Data Engine**: `@huggingface/transformers`, Dexie.js (IndexedDB), PapaParse

---
heroImage: /images/projects/qaweet.jpg
title: Qaweet — Developer QA Automation & DOM Inspection Suite
description: End-to-end QA engineering workspace featuring a browser extension, AI Model Context Protocol (MCP) server, TanStack Start dashboard, and testbed.
pubDate: '2026-05-18'
category: Developer Tools
tags:
  - Bun
  - TypeScript
  - React
  - MCP
  - TanStack Start
  - Playwright
  - Monorepo
  - Chrome Extension
featured: false
status: completed
repoUrl: https://github.com/picwellwisher12pk/QA-Ext
downloadUrl: /downloads/extensions/qaweet-suite-extension.zip
---

### Direct Suite Extension Package & Installation

- ⚡ **[Download Qaweet Suite (.zip)](/downloads/extensions/qaweet-suite-extension.zip)** — Pre-built Chromium extension package (~236 KB).
- 💻 **[GitHub Repository](https://github.com/picwellwisher12pk/QA-Ext)** — Monorepo source containing extension, MCP server, web dashboard, and testbed.

#### How to install in Chrome / Brave / Edge:
1. Download and extract the `.zip` archive.
2. In your browser, navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped directory.

---

### Overview

**Qaweet** (v1.12.2) is a developer-first QA engineering workspace and testing monorepo designed to eliminate repetitive browser validation friction, generate realistic synthetic form inputs, inspect live DOM component trees, and bridge AI coding agents directly into browser runtime environments via the **Model Context Protocol (MCP)**.

---

### Key Architecture & Capabilities

- **🤖 Model Context Protocol (MCP) Integration**:
  - Implements an `@modelcontextprotocol/sdk` server allowing AI coding assistants to programmatically trigger browser audits, DOM queries, and assertion verifications.
- **⚡ Context-Aware Synthetic Data Generation**:
  - Embedded `@faker-js/faker` engine detecting input heuristics to instantly populate complex multi-step forms with realistic test data.
- **🔍 Sidepanel DOM & Accessibility Inspector**:
  - Embedded browser sidepanel visualizing computed styles, contrast issues, accessibility trees, and DOM node hierarchies.
- **🌐 Full-Stack TanStack Start Companion**:
  - High-performance web dashboard built with **TanStack Start**, **TanStack Router**, and **Prisma ORM** over PostgreSQL for tracking test sessions and visual regression logs.
- **🧪 Edge Case Testbed & Automated Playwright E2E**:
  - Dedicated sandboxes replicating broken layouts, asynchronous race conditions, and iframes, backed by automated Playwright test suites.

---

### Tech Stack

- **Monorepo Runtime**: Bun
- **Extension Framework**: Chrome MV3, Firefox, Plasmo, React, Faker.js
- **AI Agent Protocol**: Model Context Protocol (MCP SDK), Zod
- **Web Dashboard**: TanStack Start, TanStack Router, TanStack Table, Ant Design, Prisma, PostgreSQL
- **Testing & Quality**: Playwright, Biome

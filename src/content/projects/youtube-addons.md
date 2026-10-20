---
heroImage: /images/projects/youtube-addons.jpg
title: YouTube Addons — Power Enhancements for YouTube
description: Modern browser extension providing smart video bookmarking, Xenova Transformers semantic search, custom playlists, local file backups, and Supabase sync.
pubDate: '2026-06-10'
category: Browser Extensions & Tools
tags:
  - WXT
  - React 18
  - TypeScript
  - Transformers
  - Preact Signals
  - Radix UI
  - Tailwind CSS
  - Chrome Extension
featured: false
status: completed
repoUrl: https://github.com/picwellwisher12pk/youtube-addons
downloadUrl: /downloads/extensions/youtube-addons-chrome.zip
---

### Direct Extension Package & Installation

- ⚡ **[Download YouTube Addons (.zip)](/downloads/extensions/youtube-addons-chrome.zip)** — Ready-to-load Chromium extension package (~404 KB).
- 💻 **[GitHub Repository](https://github.com/picwellwisher12pk/youtube-addons)** — Source code built with WXT and React 18.

#### How to install in Chrome / Brave / Edge:
1. Download and extract the `.zip` package to a local folder.
2. Navigate to `chrome://extensions/` in your browser.
3. Toggle **Developer mode** (top-right).
4. Click **Load unpacked** and select the extracted folder.

---

### Overview

**YouTube Addons** (v1.4.1) is a specialized browser extension that supercharges the YouTube viewing experience with high-speed thumbnail quick-saves, on-device semantic vector search powered by **`@xenova/transformers`**, custom independent playlists, automated local disk backups via the **File System Access API**, and optional **Supabase** cloud synchronization.

---

### Key Architecture & Capabilities

- **⚡ Quick Save Thumbnail Overlay**: Injected content script overlaying instant save buttons on YouTube video cards without interfering with native playback controls.
- **🧠 Client-Side Semantic Vector Search**: Embeds and indexes saved video titles and descriptions on-device using `@xenova/transformers`, delivering conceptual search without API latency or privacy loss.
- **📑 Autonomous Custom Playlists**: Organize videos into custom topical collections detached from YouTube's volatile watch-later queues.
- **💾 Local Auto-Backup Pipeline**: Hooks into the browser's native File System Access API to continuously backup video collections to a local JSON folder on your hard drive.
- **☁️ Supabase Cloud Sync**: Optional two-way synchronization enabling bookmarks and notes to follow you across devices.
- **⚛️ WXT + Preact Signals Core**: Built with the next-gen **WXT** extension framework and fine-grained Preact Signals for zero-overhead reactive state.

---

### Tech Stack

- **Extension Framework**: WXT (Chrome & Firefox MV3)
- **Frontend Stack**: React 18, Preact Signals, Tailwind CSS, Radix UI Primitives
- **AI & Storage**: `@xenova/transformers`, File System Access API, Supabase (Postgres)

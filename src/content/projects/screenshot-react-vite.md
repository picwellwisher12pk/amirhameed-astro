---
heroImage: /images/projects/screenshot-react-vite.jpg
title: Kapture — High-Performance Screen Capture & Canvas Studio
description: Modern Chrome MV3 extension for pixel-perfect screenshots, screen recording, DOM element selection, and canvas vector annotation.
pubDate: '2026-03-05'
category: Developer Tools
tags:
  - Chrome Extension
  - React 19
  - Vite 7
  - TypeScript
  - Tailwind CSS v4
  - Radix UI
  - HTML5 Canvas
  - Vitest
featured: false
status: completed
repoUrl: https://github.com/picwellwisher12pk/kapture
---

### Overview

**Kapture** (v0.6.0) is a modern, high-performance browser extension engineered for developers, QA engineers, and designers to seamlessly capture, annotate, and record web interfaces with zero friction.

Built with **React 19**, **Vite 7 (Rolldown)**, **Tailwind CSS v4**, and **Radix UI**, Kapture combines lightning-fast element inspection with an advanced HTML5 vector canvas editor and lightweight screen recorder.

---

### Key Capabilities & Architecture

- **Precision Screen Capture Modes**:
  - **DOM & Element Inspector**: Hover over any HTML element on the page for instant bounding-box detection and one-click capture.
  - **Dynamic Area Selection**: Click-and-drag crosshair rectangle selection with live dimension readouts.
  - **Smart Full-Page Capture**: Automated scroll stitching with smart handling of sticky headers, fixed navbars, and floating footers.
  - **Visible Viewport**: Instant single-frame capture of the active viewport.
- **Embedded Screen & Audio Recording**:
  - Flexible capture options for specific browser tabs, arbitrary screen regions, or full desktop displays.
  - Configurable system audio recording with WebM/MP4 exports and countdown delay timers.
- **Vector Canvas Annotation Studio**:
  - Interactive drawing layer with freehand brushes, arrows, geometric callout boxes, and customizable text tools.
  - Blur, pixelate, and redaction masks for concealing sensitive passwords or API keys before bug submission.
  - Aspect-ratio locked cropping, canvas pan, and high-DPI zoom inspection.
- **In-Page Live DOM Editing**:
  - One-click page edit mode allowing testers to modify webpage copy directly in the live DOM before capturing UI regression mocks.

---

### Tech Stack & Tooling

- **Extension Framework**: Chrome Extension Manifest V3 (MV3)
- **Frontend Stack**: React 19, TypeScript 5, Vite 7 (Rolldown)
- **Styling & UI**: Tailwind CSS v4, Radix UI Primitives, Lucide React
- **Code Quality & Testing**: Biome Formatter/Linter, Vitest with JSDOM

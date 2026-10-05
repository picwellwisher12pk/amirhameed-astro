---
heroImage: /images/projects/censor-flow.jpg
title: CensorFlow — Intelligent Video & Audio Censorship Studio
description: A client-side studio for automated and manual video/audio redaction, smart profanity bleeping, and sensitive scene auto-skipping.
pubDate: '2026-09-19'
category: AI & Multimedia Tools
tags:
  - React
  - TypeScript
  - Web Audio API
  - HTML5 Canvas
  - Tailwind CSS
featured: true
status: completed
demoUrl: https://picwellwisher12pk.github.io/censor-flow/
repoUrl: https://github.com/picwellwisher12pk/censor-flow
---

### Overview
**CensorFlow** is a web-based multimedia studio designed to give creators, educators, and families granular control over video and audio content. It allows users to define timestamps for auto-skipping sensitive scenes, blurring visual areas via canvas overlays, and bleeping or muting audio tracks.

### Key Architecture & Capabilities
- **100% Client-Side Processing**: Zero server uploads required; video streams and audio decoders run entirely in the browser memory for total privacy.
- **Web Audio API Engine**: Precise timestamped gain nodes for muting or replacing audio with custom bleep tones.
- **Interactive Timeline Editor**: Visual scrubbing, track zoom, and frame-accurate range selection built with TypeScript and Tailwind CSS.

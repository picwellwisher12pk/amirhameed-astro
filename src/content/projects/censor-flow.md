---
heroImage: /images/projects/censor-flow.jpg
title: CensorFlow — Intelligent Video & Audio Censorship Studio
description: Cross-platform video/audio censorship workstation with multi-track timeline, canvas bounding boxes, subtitle calibration, and auto-scene skipping.
pubDate: '2026-09-19'
category: AI & Multimedia Tools
tags:
  - Tauri 2
  - React
  - TypeScript
  - Web Audio API
  - HTML5 Canvas
  - Tailwind CSS
  - Desktop App
featured: true
status: completed
demoUrl: https://picwellwisher12pk.github.io/censor-flow/
repoUrl: https://github.com/picwellwisher12pk/censor-flow
downloadUrl: /downloads/censor-flow/CensorFlow-Setup.exe
---

### Live Studio Access & Downloads

- 🌐 **[Launch CensorFlow Web Studio](https://picwellwisher12pk.github.io/censor-flow/)** — Full-featured in-browser video & audio censorship workstation.
- ⚡ **[Download CensorFlow for Windows (.exe)](/downloads/censor-flow/CensorFlow-Setup.exe)** — Standalone native desktop installer (~1.44 MB).
- 💻 **[GitHub Repository](https://github.com/picwellwisher12pk/censor-flow)** — Open-source Tauri and React source code.

---

### Overview

**CensorFlow** (v1.17.0) is a versatile, cross-platform multimedia studio designed to give creators, educators, and families granular control over media censorship. It allows users to define timestamps for auto-skipping scenes, blurring video regions with interactive canvas boxes, and bleeping/muting audio tracks with millisecond precision using the portable `.censor.json` standard.

---

### Key Architecture & Capabilities

- **⚡ Dual Operating Modes**:
  - **Family Viewer Mode**: Distraction-free clean playback with customizable active filters (*Auto-skip graphic scenes*, *Bleep profanity*, *Blur explicit zones*).
  - **Creator Studio Mode**: Multi-track timeline, canvas bounding box draw overlays on video frames, frame stepping, and cue management.
- **🛡️ Dynamic Redaction Engine**:
  - **Video**: Gaussian Blur (configurable radius), Pixelate Mosaic, and solid blackout masks.
  - **Audio**: Web Audio API gain nodes with 1000 Hz synthesized bleeps, de-clicked smooth mutes, and audio ducking.
  - **Scene Skipping**: Seamlessly seeks past designated scenes during playback with predictive upcoming skip alerts.
- **📊 Multi-Track Scrubbable Timeline**:
  - Dedicated tracks for Skip intervals, Video Masks, Subtitles, and Audio Waveform visualization.
  - Interactive playhead with 60 FPS motion, 1x-4x timeline zoom, and cue trimming handles.
- **📝 Subtitle Sync & Profanity Scanner**:
  - Load `.srt` and `.vtt` tracks, align timing with 1-click snap, fix framerate drift with 2-point progressive calibration, and scan for profanity to auto-generate censorship markers.
- **🎬 FFmpeg Hard-Burn Exporter**:
  - Automatically compiles all timeline cues and skip intervals into an executable FFmpeg command string to permanently bake redactions into a master MP4.

---

### Tech Stack

- **Desktop Framework**: Tauri 2
- **Frontend Stack**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Oxlint
- **Audio & Media**: Web Audio API, HTML5 Canvas 2D, Waveform Peak Analysis

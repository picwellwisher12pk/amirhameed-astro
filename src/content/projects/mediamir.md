---
title: "MediaMir — Desktop Media Hub & Universal Streamer"
description: "High-performance desktop media center, instant torrent streamer, and reference player for the CensorFlow redaction standard built with Tauri v2, Rust, and React 19."
pubDate: 2026-11-13
category: "Desktop & Streaming"
tags:
  - Tauri 2
  - Rust
  - React 19
  - TypeScript
  - Tailwind CSS
  - BitTorrent
  - Jellyfin
  - Web Audio API
featured: true
status: "completed"
repoUrl: "https://github.com/picwellwisher12pk/mediamir"
---

### Quick Overview & Repository

- 💻 **[GitHub Repository](https://github.com/picwellwisher12pk/mediamir)** — Complete open-source Tauri v2, Rust, and React 19 codebase.
- ⚡ **Desktop Architecture**: Native Rust daemon with WebAudio and Canvas overlays on Tauri 2.0.

---

### Overview

**MediaMir** is an all-in-one modern desktop media center that fuses local and remote **Jellyfin** streaming, sequential **BitTorrent streaming**, and **IMDb 18+ Parents Guide** parental diagnostics, while acting as the flagship reference player for the **CensorFlow (`.censor.json`)** content redaction format.

Built to overcome the resource bloat and latency of Electron-based streaming clients, MediaMir executes lightweight streaming, native Cast discovery via mDNS, and frame-accurate content filtering with minimal CPU and memory footprints.

---

### Key Highlights & Architecture

#### 1. Real-Time Sequential BitTorrent Streaming
- **Instant Playback:** Streams media chunks sequentially via magnet links or `.torrent` files directly into the player buffer without waiting for full file downloads.
- **Smart Partial Resumption:** Detects existing partial downloads on disk, infers piece bitfields, and resumes stream sessions in-place.
- **Multi-File Navigation:** Seamlessly inspects multi-file torrent contents and streams selected files on demand.

#### 2. Flagship CensorFlow Reference Player
- **CanvasCensorRenderer:** Frame-accurate Gaussian blur, pixelation, and blackout bounds over sensitive visual regions.
- **AudioCensorEngine:** Real-time Web Audio API gain ducking, muting, and 1000Hz censorship bleep tones for profanity or inappropriate dialogue.
- **SkipEngine:** Intelligent automated scene jumps for violent, graphic, or sensitive segments with countdown indicators.
- **Universal Export:** Exports censor cues to standard `.edl` (Edit Decision List) for VLC, Kodi, and Jellyfin.

#### 3. TV Casting & Bidirectional Handoff
- **Native Discovery:** Automatic discovery of Chromecast and Google Cast receivers via native Rust mDNS and SSDP.
- **Bidirectional Playback Handoff:** Seamlessly switch playback between PC and TV without losing time position, audio sync, or volume state.
- **Second-Screen Companion Mode:** Use mobile or desktop web interfaces as interactive remote controllers.

#### 4. IMDb 18+ Parents Guide & Popcorn Integration
- **Granular Safety Badges:** Severity breakdowns across Sex & Nudity, Violence & Gore, Profanity, Alcohol/Drugs, and Frightening Scenes.
- **Unified Media Metadata:** Dynamic integration with Popcorn, YTS, and Jellyfin metadata backends.

---

### Tech Stack & Test Suite

- **Runtime & Build:** Bun, Vite, Rust `cargo`
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Zustand
- **Desktop Core:** Tauri 2.0 (Rust native backend for network, mDNS, and file integrity)
- **Quality Assurance:** 186 automated unit and integration tests passing across 21 test suites.

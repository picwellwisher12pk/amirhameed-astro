---
heroImage: /images/projects/quran-verse-identifier.jpg
title: Quran Verse Identifier & Context Explorer
description: High-performance monorepo identifying Quranic verses from audio recitations and phonetic inputs using Fastify, React, WaveSurfer.js, and Expo mobile.
pubDate: '2026-09-16'
category: AI & Islamic Informatics
tags:
  - Fastify
  - React
  - Expo
  - React Native
  - WaveSurfer.js
  - SQL.js
  - Audio Processing
  - TypeScript
featured: true
status: completed
demoUrl: https://quran-verse-identifier.vercel.app
repoUrl: https://github.com/picwellwisher12pk/quran-verse-identifier
---

### Live Application Access

- 🌐 **[Launch Quran Verse Identifier Web Studio](https://quran-verse-identifier.vercel.app)** — Interactive audio and text recognition studio.
- 💻 **[GitHub Repository](https://github.com/picwellwisher12pk/quran-verse-identifier)** — Complete monorepo source code including Node API, React studio, and Expo mobile app.

---

### Overview

**Quran Verse Identifier & Context Explorer** (v1.7.2) is a specialized Islamic informatics workspace engineered to identify, verify, and contextualize any of the 6,236 Ayahs of the Holy Quran from live mic recitations, uploaded audio tracks, or transliterated phonetic fragments.

The project pairs an ultra-fast **Fastify / Node.js** embedded SQL.js database backend with a reactive **React + Vite** audio studio and a cross-platform **Expo (React Native)** mobile application.

---

### Key Architecture & Capabilities

- **🎙️ Real-Time Audio Recitation Matching**: Speak or recite verses into the browser; WaveSurfer.js generates real-time frequency waveforms while speech recognition and phonetic alignment identify the exact Ayah.
- **📁 Multi-Format Audio Upload Pipeline**: Server-side processing accepting MP3, WAV, M4A, and OGG formats with acoustic feature matching.
- **⚡ Phonetic Fuzzy Search Engine**: Overcomes dialect variations and tajweed differences through normalized Arabic phonetic tokenization.
- **📖 Comprehensive Scholarly Output**:
  - Full Arabic Uthmani typography with optional diacritic toggles.
  - Authentic English translations (Sahih International, Pickthall).
  - Synchronized reference recitation audio playback for verse-by-verse acoustic confirmation.
  - Complete chapter context (Meccan/Medinan classification, revelation order, Surah index).
- **📱 Native Mobile Application**: Expo SDK client enabling mobile users to record, identify, and bookmark verses with native haptics and offline database lookups.

---

### Tech Stack

- **Monorepo Engine**: Bun, Concurrently
- **Backend**: Fastify, Express, Node.js, SQL.js embedded database
- **Web Client**: React 18, Vite, WaveSurfer.js, Web Speech API, Tailwind CSS
- **Mobile Client**: React Native, Expo SDK, Expo Audio, Haptics
- **Hosting**: Vercel (Frontend), Node/Container (API)

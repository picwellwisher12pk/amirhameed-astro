---
heroImage: /images/projects/hadith-app.jpg
title: Hadith Reader & Cross-Platform Study Suite
description: High-performance Islamic informatics monorepo with Next.js PWA, Expo mobile app, Qdrant vector search, and canonical Hadith corpora.
pubDate: '2026-07-22'
category: Web & Mobile Applications
tags:
  - Next.js
  - React Native
  - Expo
  - Turborepo
  - Qdrant
  - Prisma
  - PostgreSQL
  - TypeScript
featured: true
status: completed
demoUrl: https://hadith-app-web.vercel.app
repoUrl: https://github.com/picwellwisher12pk/hadith-app
---

### Live Application Access

- 🌐 **[Launch Hadith Reader Web App](https://hadith-app-web.vercel.app)** — Production progressive web application accessible across desktop, tablet, and mobile browsers.

---

### Overview

**Hadith Reader & Cross-Platform Study Suite** is a full-stack, multi-platform scholarly workspace engineered for deep exploration and linguistic study of primary Islamic Hadith corpora (Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami` at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah, and Muwatta Malik).

Architected as a unified **Turbo monorepo** (v1.0.6), the project pairs a modern **Next.js PWA** and an **Expo (React Native)** mobile app with an advanced semantic search engine powered by **Qdrant vector search**, client-side transformer embeddings, and Arabic diacritic normalization.

---

### Key Architecture & Capabilities

- **Unified Turbo Monorepo**: Shared TypeScript packages (`@hadith/shared`) establishing consistent schemas, normalization algorithms, and query types between `@hadith/web` and `@hadith/mobile`.
- **Hybrid & Vector Search Engine**: Combines exact token queries with a custom Arabic diacritic stripper alongside **Qdrant** semantic vector similarity for conceptual topic search across thousands of narrations.
- **Robust Database Layer**: Powered by [Prisma ORM](https://www.prisma.io/) over serverless [PostgreSQL (Neon)](https://neon.tech/) and [Supabase](https://supabase.com/), providing instant lookups across indexed narrations, isnad chains, and gradings.
- **Cross-Platform Native Experience**:
  - **Web PWA**: Next.js App Router, Radix UI primitives, Tailwind CSS, TanStack React Query, and offline PWA service workers.
  - **Native Mobile**: Expo SDK (React Native) with Expo Router, Reanimated transitions, and secure offline SQLite caching.
- **Audio & Scholarly Tools**: Synchronized Arabic audio recitations, bookmarked collections, and configurable typography (Uthmani and Indo-Pak script variants).

---

### Tech Stack

- **Monorepo**: Turborepo, Bun
- **Web App**: Next.js 15, React 19, Tailwind CSS, Radix UI, TanStack Query
- **Mobile App**: React Native, Expo, Expo Router, Reanimated
- **Database & Search**: PostgreSQL, Prisma ORM, Qdrant Vector Engine, Xenova Transformers

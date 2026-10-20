---
heroImage: /images/projects/paxamir.jpg
title: Paxamir — Multilingual Examination & Quiz Engine
description: Enterprise examination platform with Next.js, NestJS backend, TipTap KaTeX math authoring, Socket.io live proctoring, and Prisma ORM.
pubDate: '2026-04-12'
category: Web & Educational Platforms
tags:
  - Next.js
  - NestJS
  - React
  - Prisma
  - KaTeX
  - Socket.io
  - Redis
  - Tailwind CSS
featured: false
status: completed
repoUrl: https://github.com/picwellwisher12pk/paxamer
---

### Overview

**Paxamir** (v1.0.1) is an enterprise-grade digital examination and assessment workstation engineered for online competitive testing, multi-lingual evaluations, and rich STEM problem authoring.

Architected as a unified Bun monorepo, Paxamir pairs a **Next.js** student/instructor application with a **NestJS** backend API, real-time **Socket.io** event distribution, and a **TipTap** LaTeX/KaTeX mathematics editor.

---

### Key Architecture & Capabilities

- **📐 Advanced STEM & Code Authoring**:
  - Live LaTeX / KaTeX mathematical formula rendering directly inside rich text TipTap input nodes.
  - Interactive Ace code syntax editor for grading computer science tests and coding challenges.
- **🌐 Native Multi-Language & RTL Layouts**:
  - First-class i18n support with bidirectional typography (English, Urdu, Arabic) and context-aware punctuation handling.
- **⏱️ Automated Grading & Proctoring**:
  - Instantaneous scoring pipelines, randomized question banks, negative marking rules, and time-restricted exam attempts.
  - Real-time exam sync and student submission telemetry powered by **Socket.io** and **Redis**.
- **🛡️ Secure Enterprise Backend**:
  - NestJS Fastify/Express API with Prisma ORM, Redis session store, Google OAuth 2.0 authentication, and automated OpenAPI/Swagger documentation.

---

### Tech Stack

- **Monorepo Runtime**: Bun
- **Student & Instructor Web**: Next.js, React 19, NextAuth, Tailwind CSS, Canvas-Confetti
- **Assessment Studio**: React, TipTap Editor, KaTeX, Dnd-Kit, Ant Design
- **API & Storage**: NestJS, Prisma ORM, Redis, PostgreSQL / MongoDB, Socket.io

---
title: "JobSpy Studio — Desktop Job Scraping & AI Matching Control Center"
description: "Desktop automation platform and job scraping engine with AI resume tailoring, local LLM integration, and real-time application tracking."
pubDate: 2026-11-13
category: "Desktop & Automation"
tags:
  - Tauri 2
  - Rust
  - React 19
  - Python
  - AI & LLM
  - SQLite
  - TypeScript
  - Automation
featured: false
status: "completed"
repoUrl: "https://github.com/picwellwisher12pk/job-automation-project"
---

### Quick Access & Links

- 💻 **[GitHub Repository](https://github.com/picwellwisher12pk/job-automation-project)** — Desktop application and scraping pipeline.
- ⚡ **Desktop Automation**: Powered by Tauri v2 with Python JobSpy integration and SQLite persistence.

---

### Overview

**JobSpy Studio** is a unified desktop control station designed to automate job searches across multiple top employment portals (LinkedIn, Indeed, Glassdoor, ZipRecruiter) and intelligently match candidate qualifications using local and cloud-based AI models.

---

### Key Capabilities

#### 1. Multi-Board Automated Scraping Pipeline
- Unified scraping jobs across multiple international platforms without manual portal surfing.
- Automated rate limiting, proxy handling, and deduplication of job postings.

#### 2. Local AI & LLM Matching Engine
- Direct integration with local LLM runtimes (LM Studio) and HuggingFace transformers (`@xenova/transformers`).
- Automated resume tailoring, skill match scoring, and custom cover letter generation based on exact job specs.

#### 3. Persistent Job Pipeline & Application Tracker
- Embedded SQLite database storing thousands of opportunities with custom interview stages, notes, and salary benchmarks.
- Clean Kanban-style application lifecycle tracking.

---

### Tech Stack

- **Desktop Framework:** Tauri v2, Rust
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Vite, Lucide React
- **Backend & Scraping:** Python (UV, JobSpy), SQLite3
- **AI Integrations:** Transformers.js, LM Studio Local Inference API

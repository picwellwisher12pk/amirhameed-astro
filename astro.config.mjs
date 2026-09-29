// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { execSync } from 'child_process';

// Inject git commit + build timestamp at build time
let commitHash = 'dev';
const buildTime = new Date().toISOString();
try {
  commitHash = execSync('git rev-parse --short HEAD', { stdio: ['pipe', 'pipe', 'pipe'] })
    .toString()
    .trim();
} catch (_) {}

// https://astro.build/config
export default defineConfig({
  site: 'https://amirhameed.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      __COMMIT_HASH__: JSON.stringify(commitHash),
      __BUILD_TIME__: JSON.stringify(buildTime),
    },
  }
});

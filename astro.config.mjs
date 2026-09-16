// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs, sitemap.xml and social-share tags.
  // Apex domain is canonical; redirect www -> apex at Cloudflare (see SETUP.md).
  site: 'https://crew167.org',

  // Emits /by-laws/index.html rather than /by-laws.html, which is what
  // Cloudflare Pages serves most predictably.
  build: { format: 'directory' },

  integrations: [sitemap()],

  image: {
    // Gallery photos come straight off phones and cameras; cap the widths we
    // bother generating so builds stay quick and payloads stay small.
    responsiveStyles: true,
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  devToolbar: { enabled: false },
});

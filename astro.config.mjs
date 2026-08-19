// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The organization front page. No MDX and no content collections on purpose:
// long-form writing lives on the project sites, not here.
export default defineConfig({
  site: 'https://expressive-tea.io',
  integrations: [sitemap()],
});

// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages at https://felixgeekfox.github.io/rainbowcircuits/
// If you move to a custom domain later, change `site` and set `base` to '/'.
export default defineConfig({
  site: 'https://felixgeekfox.github.io',
  base: '/rainbowcircuits',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  vite: {
    server: { fs: { strict: false } },
  },
});

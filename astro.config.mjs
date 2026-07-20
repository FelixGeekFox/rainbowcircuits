// @ts-check
import { defineConfig } from 'astro/config';

// Hosted on GitHub Pages at the custom domain https://rainbowcircuits.org
// (see public/CNAME). At a custom domain the site is served from the root,
// so `base` is '/'. To revert to the github.io project URL, set:
//   site: 'https://felixgeekfox.github.io', base: '/rainbowcircuits'
export default defineConfig({
  site: 'https://rainbowcircuits.org',
  base: '/',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  vite: {
    server: { fs: { strict: false } },
  },
});

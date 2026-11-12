import { defineConfig } from 'vite';

// base './' so the build also works under a GitHub Pages sub-path (/cotudy/).
export default defineConfig({
  base: './',
  server: { port: 5180 },
});

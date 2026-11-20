import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve('.', 'index.html'),
        docs: resolve('.', 'docs/index.html'),
      },
    },
  },
});

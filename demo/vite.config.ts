import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: process.env.GITHUB_ACTIONS ? '/seasonal-lounge/' : '/',
  plugins: [react()],
  server: { host: '127.0.0.1', port: 4173 },
  build: { outDir: '../demo-dist', emptyOutDir: true },
});

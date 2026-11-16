import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import devServer from '@hono/vite-dev-server';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    devServer({
      entry: 'src/server/index.ts',
      exclude: [/^\/(?!(api)).*$/], // only handle /api requests with Hono
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});

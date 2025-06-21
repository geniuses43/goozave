import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: '/goozave/', // GitHub Pages repository subpath
  plugins: [react(), ViteSingleFile()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true, // fail if port is unavailable
  },
  build: {
    outDir: 'dist',   // ensure build outputs to 'dist'
    assetsInlineLimit: 10 * 1024 * 1024, // inline assets up to 10 MB
  },
});
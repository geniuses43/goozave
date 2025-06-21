import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/goozave/', // GitHub Pages repository subpath
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true, // fail if port is unavailable
  },
  build: {
    outDir: 'dist',   // ensure build outputs to 'dist'
  },
});
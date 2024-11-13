// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/eventHub': {
        target: 'https://localhost:7062', // Cambia al puerto de tu servidor backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

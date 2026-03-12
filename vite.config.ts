import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ESTA SECCIÓN ES LA NUEVA IMPORTANTE
  build: {
    outDir: 'build',       // Cambiamos 'dist' por 'build' para Nginx
    emptyOutDir: true,     // Limpia la carpeta antes de compilar
  },
  server: {
    port: 5174,
    // El proxy solo sirve en desarrollo (npm run dev), 
    // en producción Nginx se encarga del proxy.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:3001',
        ws: true,
      },
    },
  },
});

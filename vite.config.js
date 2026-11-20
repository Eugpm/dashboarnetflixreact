import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' permite desplegar en Vercel o GitHub Pages sin cambiar rutas.
export default defineConfig({
  plugins: [react()],
  base: './',
});

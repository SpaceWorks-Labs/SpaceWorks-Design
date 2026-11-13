import { defineConfig } from 'vite';
import tailwind from '@tailwindcss/postcss';
export default defineConfig({
  base: './',
  css: { postcss: { plugins: [tailwind()] } },
  build: { emptyOutDir: false },
});

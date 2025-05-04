import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from '@svgr/rollup';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    svgr()
  ],
  base: process.env.GITHUB_REF === 'refs/heads/main' 
  ? '/BestInQuest-Web/' 
  : '/BestInQuest-Web/dev/'
  build: {
    outDir: 'dist',          // явно указываем выходную папку
    assetsDir: 'assets',
    emptyOutDir: true        // очищаем перед сборкой
  }
})

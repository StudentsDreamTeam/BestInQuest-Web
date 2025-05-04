import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from '@svgr/rollup';

// https://vite.dev/config/
export default defineConfig({
  base: '/BestInQuest-Web/',
  plugins: [
    react(),
    svgr()
  ],
  base: process.env.GITHUB_REF === 'refs/heads/main' ? '/' : '/dev/',
  build: {
    outDir: 'dist',          // явно указываем выходную папку
    emptyOutDir: true        // очищаем перед сборкой
  }
})

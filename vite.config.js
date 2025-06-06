import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from '@svgr/rollup';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  base: process.env.GITHUB_REF === 'refs/heads/develop' ? '/dev/' : '/',
  build: {
    outDir: 'dist',          // явно указываем выходную папку
    assetsDir: 'assets',
    emptyOutDir: true        // очищаем перед сборкой
  }
})

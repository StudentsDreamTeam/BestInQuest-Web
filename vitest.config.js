import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    deps: {
      inline: ['react']
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      // Можно добавить и другие опции, например, include/exclude:
      // include: ['src/**/*.{js,jsx,ts,tsx}'],
      // exclude: ['src/**/__tests__/**', 'src/setupTests.js'],
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}) 

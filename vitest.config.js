import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Основные настройки
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    
    // Покрытие кода для SonarCloud
    coverage: {
      provider: 'c8', // Лучше работает с React 19
      enabled: true,
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov', 'json-summary'],
      all: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        '**/*.stories.*',
        '**/__mocks__/**',
        'src/main.jsx',
        'src/setupTests.js'
      ]
    },

    // Совместимость с React 19
    deps: {
      inline: [
        'react',
        'react-dom',
        'react-router-dom',
        'styled-components',
        '@testing-library/react'
      ],
      fallbackCJS: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

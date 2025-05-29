import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic' // Важно для React 19
  })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    
    coverage: {
      provider: 'c8',
      enabled: true,
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov', 'json-summary', 'json'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      },
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        '**/*.stories.*',
        '**/*.d.ts',
        '**/__mocks__/**',
        'src/main.{js,jsx,ts,tsx}',
        'src/setupTests.js'
      ]
    },

    deps: {
      inline: [
        'react',
        'react-dom',
        'react-router-dom',
        'styled-components',
        '@testing-library/react',
        '@testing-library/jest-dom'
      ],
      fallbackCJS: true
    },

    // Для лучшей производительности
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})

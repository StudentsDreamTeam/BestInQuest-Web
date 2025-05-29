import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    deps: {
      inline: ['react']
    },
    coverage: {
      provider: 'v8', // или 'istanbul' (если 'v8' не работает)
      reporter: ['text', 'lcov'], // 'lcov' для Sonar
      reportsDirectory: './coverage', // папка с отчетами
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});

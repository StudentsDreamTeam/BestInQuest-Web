import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // или 'istanbul' (если 'v8' не работает)
      reporter: ['text', 'lcov'], // 'lcov' для Sonar
      reportsDirectory: './coverage', // папка с отчетами
    },
  },
});

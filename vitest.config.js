import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'c8',               // Используем c8 для покрытия
      reporter: ['text', 'json', 'lcov'], // lcov нужен для SonarCloud
      reportsDirectory: './coverage', // Папка для отчётов
      include: ['src/**/*.{js,jsx,ts,tsx}'], // Что проверяем
      exclude: [                     // Что игнорируем
        '**/__mocks__/**',
        '**/*.d.ts',
        'src/main.{jsx,tsx}',
      ],
    },
  },
});

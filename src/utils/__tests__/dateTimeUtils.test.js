import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDeadlineForDisplay,
  formatDateTimeForInput,
  secondsToHHMM,
  hhMMToSeconds,
  formatDurationForDisplay,
  formatFullDateTime,
  formatTaskCardDateTime,
  formatTaskCardDuration
} from '../dateTimeUtils';

// Гарантируем, что мы тестируем реальные функции, а не мок из других тестов
vi.unmock('../dateTimeUtils'); 

describe('dateTimeUtils', () => {
  let originalLocaleString; // Будет использоваться для восстановления в каждом релевантном afterEach
  let mockConsoleError;

  beforeEach(() => {
    // Мокаем console.error глобально для всех тестов в этом describe
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Сохраняем оригинальный toLocaleString, чтобы можно было восстановить
    originalLocaleString = Date.prototype.toLocaleString;
  });

  afterEach(() => {
    // Восстанавливаем console.error
    mockConsoleError.mockRestore();
    // Восстанавливаем toLocaleString, если он был изменен в тесте
    Date.prototype.toLocaleString = originalLocaleString;
    vi.clearAllMocks(); // Очищаем все моки vi (spyOn, fn и т.д.)
    vi.useRealTimers(); // Убедимся, что реальные таймеры восстановлены после каждого теста
  });

  // --- formatDeadlineForDisplay ---
  describe('formatDeadlineForDisplay', () => {
    it('should return "Не выбран" for no input', () => {
      expect(formatDeadlineForDisplay()).toBe('Не выбран');
      expect(formatDeadlineForDisplay(null)).toBe('Не выбран');
      expect(formatDeadlineForDisplay(undefined)).toBe('Не выбран');
    });

    it('should return "Ошибка даты" for invalid date string', () => {
      // Для этой проверки важно, чтобы new Date('invalid-date') давал Invalid Date
      vi.useRealTimers(); // Используем реальные таймеры для этой проверки
      expect(formatDeadlineForDisplay('invalid-date')).toBe('Ошибка даты');
      vi.useFakeTimers(); // Возвращаем фейковые, если они нужны другим тестам (хотя тут вроде нет)
    });

    it('should format valid ISO string correctly', () => {
      const specificMock = vi.fn(() => '31.12.2023 15:00');
      Date.prototype.toLocaleString = specificMock;
      expect(formatDeadlineForDisplay('2023-12-31T15:00:00.000Z')).toBe('31.12.2023 15:00');
      expect(specificMock).toHaveBeenCalledWith('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
      Date.prototype.toLocaleString = originalLocaleString; // Восстанавливаем немедленно
    });

    it('should format valid Date object correctly', () => {
      const specificMock = vi.fn(() => '01.01.2024 10:30');
      Date.prototype.toLocaleString = specificMock;
      const dateObj = new Date(2024, 0, 1, 10, 30); // 1 января 2024, 10:30
      expect(formatDeadlineForDisplay(dateObj)).toBe('01.01.2024 10:30');
      Date.prototype.toLocaleString = originalLocaleString; // Восстанавливаем немедленно
    });
  });

  // --- formatDateTimeForInput ---
  describe('formatDateTimeForInput', () => {
    // Для этих тестов не обязательно использовать vi.useRealTimers() / vi.useFakeTimers(), 
    // так как мы создаем конкретные объекты Date и проверяем их компоненты.
    // Главное, чтобы new Date() правильно парсил входные данные.

    it('should return empty string for no input or invalid date', () => {
      expect(formatDateTimeForInput()).toBe('');
      expect(formatDateTimeForInput(null)).toBe('');
      expect(formatDateTimeForInput('invalid-date-string')).toBe('');
    });

    it('should format valid ISO string (which is UTC) to YYYY-MM-DDTHH:mm (maintaining UTC values)', () => {
      // ISO строка 'Z' означает UTC. new Date() парсит это в UTC.
      // formatDateTimeForInput использует getUTCHours() и т.д., так что значения должны сохраниться.
      expect(formatDateTimeForInput('2023-12-31T15:00:00.000Z')).toBe('2023-12-31T15:00');
      expect(formatDateTimeForInput('2024-01-05T08:05:30.123Z')).toBe('2024-01-05T08:05');
    });

    it('should format valid Date object to YYYY-MM-DDTHH:mm using its UTC representation', () => {
      // Создаем дату, которая в локальном времени 5 декабря 2023, 07:08
      const localDate = new Date(2023, 11, 5, 7, 8, 0, 0);
      
      // formatDateTimeForInput будет использовать getUTCFullYear(), getUTCMonth() и т.д.
      // Поэтому нам нужно вычислить ожидаемые UTC компоненты.
      const expectedYear = localDate.getUTCFullYear();
      const expectedMonth = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
      const expectedDay = localDate.getUTCDate().toString().padStart(2, '0');
      const expectedHours = localDate.getUTCHours().toString().padStart(2, '0');
      const expectedMinutes = localDate.getUTCMinutes().toString().padStart(2, '0');
      
      expect(formatDateTimeForInput(localDate)).toBe(`${expectedYear}-${expectedMonth}-${expectedDay}T${expectedHours}:${expectedMinutes}`);
    });
  });

  // --- secondsToHHMM ---
  describe('secondsToHHMM', () => {
    it('should return "00:00" for invalid inputs', () => {
      expect(secondsToHHMM(null)).toBe('00:00');
      expect(secondsToHHMM(undefined)).toBe('00:00');
      expect(secondsToHHMM(-100)).toBe('00:00');
      expect(secondsToHHMM(NaN)).toBe('00:00');
    });
    it('should convert seconds to HH:MM format', () => {
      expect(secondsToHHMM(0)).toBe('00:00');
      expect(secondsToHHMM(59)).toBe('00:00');
      expect(secondsToHHMM(60)).toBe('00:01');
      expect(secondsToHHMM(3599)).toBe('00:59');
      expect(secondsToHHMM(3600)).toBe('01:00');
      expect(secondsToHHMM(3660)).toBe('01:01');
      expect(secondsToHHMM(86399)).toBe('23:59');
    });
  });

  // --- hhMMToSeconds ---
  describe('hhMMToSeconds', () => {
    it('should return 0 for invalid inputs', () => {
      expect(hhMMToSeconds(null)).toBe(0);
      expect(hhMMToSeconds(undefined)).toBe(0);
      expect(hhMMToSeconds('')).toBe(0);
      expect(hhMMToSeconds('invalid')).toBe(0);
      expect(hhMMToSeconds('12:aa')).toBe(0);
      expect(hhMMToSeconds('bb:30')).toBe(0);
      expect(hhMMToSeconds('123:45')).toBe(0);
    });
    it('should convert HH:MM string to seconds', () => {
      expect(hhMMToSeconds('00:00')).toBe(0);
      expect(hhMMToSeconds('00:01')).toBe(60);
      expect(hhMMToSeconds('00:59')).toBe(3540);
      expect(hhMMToSeconds('01:00')).toBe(3600);
      expect(hhMMToSeconds('01:01')).toBe(3660);
      expect(hhMMToSeconds('23:59')).toBe(86340);
    });
  });

  // --- formatDurationForDisplay ---
  describe('formatDurationForDisplay', () => {
    it('should return "Не выбрана" for invalid inputs', () => {
      expect(formatDurationForDisplay(null)).toBe('Не выбрана');
      expect(formatDurationForDisplay(undefined)).toBe('Не выбрана');
      expect(formatDurationForDisplay('abc')).toBe('Не выбрана');
      expect(formatDurationForDisplay(-100)).toBe('Не выбрана');
      expect(formatDurationForDisplay(NaN)).toBe('Не выбрана');
    });
    it('should format duration correctly', () => {
      expect(formatDurationForDisplay(0)).toBe('0 мин');
      expect(formatDurationForDisplay(59)).toBe('0 мин');
      expect(formatDurationForDisplay(60)).toBe('1 мин');
      expect(formatDurationForDisplay(120)).toBe('2 мин');
      expect(formatDurationForDisplay(3599)).toBe('59 мин');
      expect(formatDurationForDisplay(3600)).toBe('1 ч');
      expect(formatDurationForDisplay(3660)).toBe('1 ч 1 мин');
      expect(formatDurationForDisplay(7200)).toBe('2 ч');
      expect(formatDurationForDisplay(7259)).toBe('2 ч'); 
      expect(formatDurationForDisplay(7260)).toBe('2 ч 1 мин');
    });
  });

  // --- formatFullDateTime ---
  describe('formatFullDateTime', () => {
    it('should return "неизвестно" for no input', () => {
      expect(formatFullDateTime()).toBe('неизвестно');
      expect(formatFullDateTime(null)).toBe('неизвестно');
    });
    it('should return "Неверная дата" for invalid date string', () => {
      vi.useRealTimers();
      expect(formatFullDateTime('invalid-date')).toBe('Неверная дата');
      vi.useFakeTimers(); 
    });
    it('should format date with toLocaleString', () => {
      const specificMock = vi.fn(() => '31 декабря 2023 г., 15:00');
      Date.prototype.toLocaleString = specificMock;
      expect(formatFullDateTime('2023-12-31T15:00:00Z')).toBe('31 декабря 2023 г., 15:00');
      expect(specificMock).toHaveBeenCalledWith('ru-RU', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      Date.prototype.toLocaleString = originalLocaleString;
    });
  });

  // --- formatTaskCardDateTime ---
  describe('formatTaskCardDateTime', () => {
    it('should return "Нет дедлайна" for no input', () => {
      expect(formatTaskCardDateTime()).toBe('Нет дедлайна');
      expect(formatTaskCardDateTime(null)).toBe('Нет дедлайна');
    });
    it('should return input string for invalid date (fallback behavior)', () => {
      vi.useRealTimers();
      expect(formatTaskCardDateTime('invalid-date-string')).toBe('invalid-date-string');
      expect(mockConsoleError).toHaveBeenCalled();
      vi.useFakeTimers();
    });
    it('should format date for task card', () => {
      const specificMock = vi.fn(() => 'дек. 31, 15:00');
      Date.prototype.toLocaleString = specificMock;
      expect(formatTaskCardDateTime('2023-12-31T15:00:00Z')).toBe('дек. 31, 15:00');
      expect(specificMock).toHaveBeenCalledWith('ru-RU', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      Date.prototype.toLocaleString = originalLocaleString;
    });
  });

  // --- formatTaskCardDuration ---
  describe('formatTaskCardDuration', () => {
    it('should default to "0 сек" for invalid or negative inputs', () => {
      expect(formatTaskCardDuration(null)).toBe('0 сек');
      expect(formatTaskCardDuration(undefined)).toBe('0 сек');
      expect(formatTaskCardDuration('abc')).toBe('0 сек');
      expect(formatTaskCardDuration(-100)).toBe('0 сек');
      expect(formatTaskCardDuration(NaN)).toBe('0 сек');
    });
    it('should format duration for task card', () => {
      expect(formatTaskCardDuration(0)).toBe('0 сек');
      expect(formatTaskCardDuration(30)).toBe('30 сек');
      expect(formatTaskCardDuration(59)).toBe('59 сек');
      expect(formatTaskCardDuration(60)).toBe('1 мин');
      expect(formatTaskCardDuration(119)).toBe('1 мин');
      expect(formatTaskCardDuration(120)).toBe('2 мин');
      expect(formatTaskCardDuration(3599)).toBe('59 мин');
      expect(formatTaskCardDuration(3600)).toBe('1 ч');
      expect(formatTaskCardDuration(3659)).toBe('1 ч'); 
      expect(formatTaskCardDuration(3660)).toBe('1 ч 1 мин');
      expect(formatTaskCardDuration(7199)).toBe('1 ч 59 мин');
      expect(formatTaskCardDuration(7200)).toBe('2 ч');
      expect(formatTaskCardDuration(9000)).toBe('2 ч 30 мин');
    });
  });
}); 
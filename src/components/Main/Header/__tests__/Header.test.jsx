import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  const mockTitle = 'Тестовый заголовок';

  beforeEach(() => {
    vi.useFakeTimers(); // Используем фейковые таймеры
  });

  afterEach(() => {
    vi.runOnlyPendingTimers(); // Выполняем оставшиеся таймеры
    vi.useRealTimers(); // Восстанавливаем реальные таймеры
    vi.clearAllMocks();
  });

  it('renders the title and initial date correctly', () => {
    const mockDate = new Date(2023, 11, 31, 10, 0, 0); // 31 декабря 2023, 10:00:00
    vi.setSystemTime(mockDate);

    render(<Header title={mockTitle} />);

    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    // Формат: { month: 'long', day: 'numeric' } -> "31 декабря"
    expect(screen.getByText('31 декабря')).toBeInTheDocument();
  });

  it('updates the date every minute', () => {
    const initialDate = new Date(2023, 11, 31, 23, 59, 30); // 31 дек, 23:59:30
    const dateAfterOneMinute = new Date(2024, 0, 1, 0, 0, 30); // 1 янв, 00:00:30

    vi.setSystemTime(initialDate);
    render(<Header title={mockTitle} />); 
    expect(screen.getByText('31 декабря')).toBeInTheDocument();

    // Мокаем Date конструктор, чтобы контролировать, что возвращает new Date() внутри setInterval
    const mockNewDate = vi.fn(() => dateAfterOneMinute);
    const OriginalDate = global.Date;
    global.Date = mockNewDate;

    act(() => {
      vi.advanceTimersByTime(60000); // Продвигаем на 1 минуту
    });
    
    // Ожидаем, что mockNewDate был вызван (setCurrentDate(new Date()))
    expect(mockNewDate).toHaveBeenCalled();
    // И что дата на экране обновилась
    expect(screen.getByText('1 января')).toBeInTheDocument();

    global.Date = OriginalDate; // Восстанавливаем оригинальный Date
  });

  it('clears the interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = render(<Header title={mockTitle} />); 
    
    expect(clearIntervalSpy).not.toHaveBeenCalled(); // Не должен быть вызван до unmount

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    
    clearIntervalSpy.mockRestore();
  });

  it('renders correctly with a different title', () => {
    const anotherTitle = "Другой Заголовок";
    const mockDate = new Date(2024, 0, 15); // 15 января 2024
    vi.setSystemTime(mockDate);

    render(<Header title={anotherTitle} />);
    expect(screen.getByText(anotherTitle)).toBeInTheDocument();
    expect(screen.getByText('15 января')).toBeInTheDocument();
  });
}); 
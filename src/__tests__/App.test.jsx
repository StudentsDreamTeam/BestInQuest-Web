import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App'; // Импортируем App, который включает UserProvider и AppContent
import { useUser } from '../contexts/UserContext';

// Мокаем дочерние компоненты и контексты, чтобы тестировать логику AppContent изолированно
vi.mock('../contexts/UserContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // Импортируем UserProvider как есть
    useUser: vi.fn(), // Мокаем только useUser
  };
});

vi.mock('../layouts/AppLayout', () => ({
  default: () => <div data-testid="app-layout">AppLayout Mock</div>,
}));

vi.mock('../features/auth/components/LoginPage', () => ({
  default: () => <div data-testid="login-page">LoginPage Mock</div>,
}));

vi.mock('../contexts/TasksContext', () => ({
  // TasksProvider просто оборачивает children, мок должен делать то же самое
  TasksProvider: ({ children }) => <div data-testid="tasks-provider">{children}</div>,
}));


describe('App Component Logic (via AppContent)', () => {
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    vi.clearAllMocks();
    useUser.mockReset();
  });

  it('renders LoadingOverlay when isLoadingUser is true', async () => {
    useUser.mockReturnValue({
      isLoadingUser: true,
      user: null,
      userError: null,
    });

    render(<App />);

    expect(screen.getByText('Проверка сессии...')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument();
  });

  it('renders LoginPage when not loading and no user', async () => {
    useUser.mockReturnValue({
      isLoadingUser: false,
      user: null,
      userError: null,
    });

    render(<App />);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByText('Проверка сессии...')).not.toBeInTheDocument();
    expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument();
  });

  it('renders LoginPage and logs warning when not loading, no user, but userError exists', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const testError = 'Test session error';
    useUser.mockReturnValue({
      isLoadingUser: false,
      user: null,
      userError: testError,
    });

    render(<App />);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Ошибка при автоматическом входе, отображается страница входа:",
      testError
    );
    expect(screen.queryByText('Проверка сессии...')).not.toBeInTheDocument();
    expect(screen.queryByTestId('app-layout')).not.toBeInTheDocument();
    
    consoleWarnSpy.mockRestore();
  });

  it('renders AppLayout (via TasksProvider) when user is authenticated', async () => {
    useUser.mockReturnValue({
      isLoadingUser: false,
      user: { id: '1', name: 'Test User' },
      userError: null,
    });

    render(<App />);

    // Ожидаем, что AppLayout будет внутри TasksProvider
    const tasksProvider = screen.getByTestId('tasks-provider');
    expect(tasksProvider).toBeInTheDocument();
    // Используем within для поиска внутри TasksProvider, но это не обязательно, если testid уникален
    // import { within } from '@testing-library/react';
    // expect(within(tasksProvider).getByTestId('app-layout')).toBeInTheDocument(); 
    // Проще просто искать app-layout
    expect(screen.getByTestId('app-layout')).toBeInTheDocument();

    expect(screen.queryByText('Проверка сессии...')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });
}); 
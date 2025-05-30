import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, act, screen } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';
import * as userApi from '../../services/userApi';

// Мок userApi
vi.mock('../../services/userApi', () => ({
  fetchUserById: vi.fn(),
  loginUser: vi.fn(),
}));

// Мок localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


// Компонент для тестирования хука useUser и получения значения контекста
const TestConsumerComponent = ({ onContextChange }) => {
  const contextValue = useUser();
  if (onContextChange) {
    onContextChange(contextValue);
  }
  return (
    <>
      <div data-testid="user-id">{contextValue.user?.id || 'no-user'}</div>
      <div data-testid="user-error">{contextValue.userError}</div>
    </>
  );
};

describe('UserContext', () => {
  let capturedContextValue;

  const renderWithProvider = (ui, options) => {
    return render(<UserProvider>{ui}</UserProvider>, options);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    capturedContextValue = null;
    userApi.fetchUserById.mockReset();
    userApi.loginUser.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initialization and Session Restore', () => {
    it('initializes with no user, and eventually isLoadingUser is false and no error', async () => {
      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );
      await waitFor(() => {
        expect(capturedContextValue.isLoadingUser).toBe(false);
      });
      expect(capturedContextValue.user).toBeNull();
      expect(screen.getByTestId('user-error').textContent).toBe('');
      expect(userApi.fetchUserById).not.toHaveBeenCalled();
    });

    it('restores session successfully if user ID is in localStorage', async () => {
      const mockUserId = '123';
      const mockUserData = { id: mockUserId, name: 'Test User' };
      localStorageMock.setItem('BIQ_USER_ID', mockUserId);
      userApi.fetchUserById.mockResolvedValue(mockUserData);

      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );

      await waitFor(() => {
        expect(capturedContextValue.isLoadingUser).toBe(false);
      });

      expect(userApi.fetchUserById).toHaveBeenCalledWith(mockUserId);
      expect(capturedContextValue.user).toEqual(mockUserData);
      expect(screen.getByTestId('user-error').textContent).toBe('');
    });

    it('handles error and clears localStorage if session restore fails', async () => {
      const mockUserId = '123';
      const error = new Error('Failed to fetch user');
      localStorageMock.setItem('BIQ_USER_ID', mockUserId);
      userApi.fetchUserById.mockRejectedValue(error);
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );

      await waitFor(() => {
        expect(capturedContextValue.isLoadingUser).toBe(false);
      });
      
      expect(userApi.fetchUserById).toHaveBeenCalledWith(mockUserId);
      expect(capturedContextValue.user).toBeNull();
      expect(screen.getByTestId('user-error').textContent).toBe(error.message);
      expect(localStorageMock.getItem('BIQ_USER_ID')).toBeNull();
      
      consoleErrorSpy.mockRestore();
    });

    it('does not attempt to fetch user if no ID in localStorage', async () => {
      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );

      await waitFor(() => {
        expect(capturedContextValue.isLoadingUser).toBe(false);
      });

      expect(userApi.fetchUserById).not.toHaveBeenCalled();
      expect(capturedContextValue.user).toBeNull();
      expect(screen.getByTestId('user-error').textContent).toBe('');
    });
  });

  describe('Login Function', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('logs in successfully, updates user state, and stores ID in localStorage', async () => {
      const mockUserId = '456';
      const mockUserData = { id: mockUserId, name: 'Logged In User', email };
      userApi.loginUser.mockResolvedValue(mockUserData);

      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );
      await waitFor(() => expect(capturedContextValue.isLoadingUser).toBe(false));
      
      let loginResult;
      await act(async () => {
        loginResult = await capturedContextValue.login(email, password);
      });

      expect(userApi.loginUser).toHaveBeenCalledWith(email, password);
      expect(screen.getByTestId('user-id').textContent).toBe(mockUserId);
      expect(localStorageMock.getItem('BIQ_USER_ID')).toBe(mockUserId);
      expect(capturedContextValue.isLoadingUser).toBe(false);
      expect(screen.getByTestId('user-error').textContent).toBe('');
      expect(loginResult).toEqual(mockUserData);
    });

    it('handles login failure, sets error, and clears user/localStorage', async () => {
      const error = new Error('Login failed');
      userApi.loginUser.mockRejectedValue(error);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );
      await waitFor(() => expect(screen.getByTestId('user-id').textContent).toBe('no-user'));
      await waitFor(() => expect(capturedContextValue.isLoadingUser).toBe(false));
      expect(screen.getByTestId('user-error').textContent).toBe('');

      let loginPromise;
      act(() => {
        loginPromise = capturedContextValue.login(email, password);
      });

      // Ожидаем, что промис отклонится
      await expect(loginPromise).rejects.toThrow(error.message);
      
      // Теперь ждем обновления DOM для user-error
      await waitFor(() => {
        expect(screen.getByTestId('user-error').textContent).toBe(error.message);
      });

      expect(userApi.loginUser).toHaveBeenCalledWith(email, password);
      expect(screen.getByTestId('user-id').textContent).toBe('no-user');
      expect(localStorageMock.getItem('BIQ_USER_ID')).toBeNull();
      await waitFor(() => expect(capturedContextValue.isLoadingUser).toBe(false)); 
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Logout Function', () => {
    it('clears user state, removes ID from localStorage, and clears error after login', async () => {
      const email = 'logout@example.com';
      const password = 'passwordlogout';
      const mockUserId = '789';
      const mockLoginData = { id: mockUserId, name: 'User To Logout', email };
      userApi.loginUser.mockResolvedValue(mockLoginData);

      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );
      await waitFor(() => expect(capturedContextValue.isLoadingUser).toBe(false));

      await act(async () => {
        await capturedContextValue.login(email, password);
      });
      
      await waitFor(() => expect(screen.getByTestId('user-id').textContent).toBe(mockUserId));

      act(() => {
        capturedContextValue.logout();
      });

      expect(screen.getByTestId('user-id').textContent).toBe('no-user');
      expect(localStorageMock.getItem('BIQ_USER_ID')).toBeNull();
      expect(screen.getByTestId('user-error').textContent).toBe('');
    });
  });

  describe('reloadUser Function', () => {
    it('successfully reloads user data if user is already in state', async () => {
      const initialUserId = 'userInState1';
      const initialUserData = { id: initialUserId, name: 'Initial User' };
      const reloadedUserData = { id: initialUserId, name: 'Reloaded User Name' };
      
      const loginEmail = 'reload@test.com';
      const loginPassword = 'pw';
      userApi.loginUser.mockResolvedValue(initialUserData); 
      localStorageMock.clear();

      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );
      await act(async () => { await capturedContextValue.login(loginEmail, loginPassword); });
      await waitFor(() => expect(screen.getByTestId('user-id').textContent).toBe(initialUserId));
      
      userApi.fetchUserById.mockClear(); 
      userApi.fetchUserById.mockResolvedValue(reloadedUserData);

      await act(async () => {
        await capturedContextValue.reloadUser();
      });

      expect(userApi.fetchUserById).toHaveBeenCalledWith(initialUserId);
      await waitFor(() => expect(capturedContextValue.user).toEqual(reloadedUserData)); 
      expect(screen.getByTestId('user-error').textContent).toBe('');
    });

    it('successfully reloads user data using ID from localStorage if user not in state', async () => {
      const storedUserId = 'userInStorage2';
      const reloadedUserData = { id: storedUserId, name: 'Reloaded From Storage' };
      
      localStorageMock.clear();
      userApi.fetchUserById.mockResolvedValueOnce(reloadedUserData); 

      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );
      await waitFor(() => expect(capturedContextValue.isLoadingUser).toBe(false));
      expect(screen.getByTestId('user-id').textContent).toBe('no-user'); 
      
      localStorageMock.setItem('BIQ_USER_ID', storedUserId);
      userApi.fetchUserById.mockClear();
      userApi.fetchUserById.mockResolvedValue(reloadedUserData); 

      await act(async () => {
        await capturedContextValue.reloadUser();
      });

      expect(userApi.fetchUserById).toHaveBeenCalledWith(storedUserId);
      await waitFor(() => expect(screen.getByTestId('user-id').textContent).toBe(storedUserId));
      expect(screen.getByTestId('user-error').textContent).toBe('');
    });

    it('handles error during reloadUser and clears user/localStorage', async () => {
      const userId = 'userToFailReload';
      const error = new Error('Reload failed');
      userApi.loginUser.mockResolvedValue({ id: userId, name: 'Test'}); 
      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );
      await act(async () => { await capturedContextValue.login('fail@reload.com', 'pw'); });
      await waitFor(() => expect(screen.getByTestId('user-id').textContent).toBe(userId));
      
      userApi.fetchUserById.mockRejectedValue(error);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await act(async () => {
        await capturedContextValue.reloadUser();
      });

      expect(userApi.fetchUserById).toHaveBeenCalledWith(userId);
      await waitFor(() => {
        expect(screen.getByTestId('user-id').textContent).toBe('no-user');
        expect(screen.getByTestId('user-error').textContent).toBe(error.message);
        expect(localStorageMock.getItem('BIQ_USER_ID')).toBeNull();
      });
      expect(capturedContextValue.isLoadingUser).toBe(false);
      consoleErrorSpy.mockRestore();
    });

    it('sets error if no user ID is available for reloadUser', async () => {
      localStorageMock.clear();
      renderWithProvider(
        <TestConsumerComponent onContextChange={(ctx) => capturedContextValue = ctx} />
      );
      await waitFor(() => expect(capturedContextValue.isLoadingUser).toBe(false));
      expect(screen.getByTestId('user-id').textContent).toBe('no-user');
      userApi.fetchUserById.mockClear();

      await act(async () => {
        await capturedContextValue.reloadUser();
      });
      
      expect(userApi.fetchUserById).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByTestId('user-error').textContent).toBe('Невозможно перезагрузить пользователя: ID не найден.');
      });
      expect(capturedContextValue.isLoadingUser).toBe(false);
      expect(screen.getByTestId('user-id').textContent).toBe('no-user');
    });
  });

  describe('useUser Hook', () => {
    it('returns context value when used within UserProvider', () => {
      let contextFromHook;
      const TestComponent = () => {
        contextFromHook = useUser();
        return null;
      };
      renderWithProvider(<TestComponent />);
      expect(contextFromHook).toBeDefined();
      expect(contextFromHook).toHaveProperty('user');
      expect(contextFromHook).toHaveProperty('isLoadingUser');
      expect(contextFromHook).toHaveProperty('login');
      expect(contextFromHook).toHaveProperty('logout');
    });

    it('throws error when used outside UserProvider', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const ComponentCallingHook = () => {
          useUser(); 
          return <div>Content</div>;
      }
      
      expect(() => render(<ComponentCallingHook />)).toThrow('useUser must be used within a UserProvider');
      
      consoleErrorSpy.mockRestore();
    });
  });
}); 
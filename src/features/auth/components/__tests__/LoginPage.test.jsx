import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../LoginPage'
import { UserProvider } from '../../../../contexts/UserContext'

// Мок для UserContext с задержкой для имитации реального API
const mockLogin = vi.fn().mockImplementation((email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password123') {
        resolve()
      } else {
        reject(new Error('Неверные учетные данные'))
      }
    }, 100)
  })
})

vi.mock('../../../../contexts/UserContext', () => ({
  useUser: () => ({
    login: mockLogin
  }),
  UserProvider: ({ children }) => <div>{children}</div>,
}))

describe('LoginPage', () => {
  // Мокаем console.error и console.log перед каждым тестом
  const originalError = console.error
  const originalLog = console.log
  
  beforeEach(() => {
    mockLogin.mockClear()
    console.error = vi.fn()
    console.log = vi.fn()
  })

  // Восстанавливаем console.error и console.log после каждого теста
  afterEach(() => {
    console.error = originalError
    console.log = originalLog
  })

  it('renders login form correctly', () => {
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    // Проверяем наличие всех элементов формы
    expect(screen.getByText('Best in Quest')).toBeInTheDocument()
    expect(screen.getByText('Вход в профиль')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Электронная почта')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
    expect(screen.getByText('Войти')).toBeInTheDocument()
    expect(screen.getByText('Создать профиль')).toBeInTheDocument()
    expect(screen.getByText('Не помню пароль')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByText('Войти')

    await act(async () => {
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
    })

    // Проверяем начальное состояние
    expect(submitButton).not.toBeDisabled()
    expect(screen.getByText('Создать профиль')).not.toBeDisabled()

    await act(async () => {
      await user.click(submitButton)
    })

    // Проверяем состояние во время отправки
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Вход...')
      expect(submitButton).toBeDisabled()
      expect(screen.getByText('Создать профиль')).toBeDisabled()
    })

    // Проверяем финальное состояние
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(screen.queryByText(/ошибка входа/i)).not.toBeInTheDocument()
    })
  })

  it('handles failed login', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByText('Войти')

    await act(async () => {
      await user.type(emailInput, 'wrong@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)
    })

    // Проверяем состояние во время отправки
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Вход...')
    })

    // Проверяем финальное состояние
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword')
      expect(screen.getByText(/неверные учетные данные/i)).toBeInTheDocument()
      expect(submitButton).toHaveTextContent('Войти')
    })

    // Проверяем, что ошибка была залогирована
    expect(console.error).toHaveBeenCalled()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const passwordInput = screen.getByPlaceholderText('Пароль')
    const toggleButton = screen.getByText('Показать')

    // Изначально пароль скрыт
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Нажимаем кнопку показать пароль
    await act(async () => {
      await user.click(toggleButton)
    })
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(toggleButton).toHaveTextContent('Скрыть')

    // Нажимаем кнопку скрыть пароль
    await act(async () => {
      await user.click(toggleButton)
    })
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(toggleButton).toHaveTextContent('Показать')
  })

  it('handles "Создать профиль" button click', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const createProfileButton = screen.getByText('Создать профиль')
    
    await act(async () => {
      await user.click(createProfileButton)
    })

    // Проверяем, что был вызван console.log
    expect(console.log).toHaveBeenCalledWith('Переход на страницу создания профиля (пока не реализовано)')
  })

  it('validates email field', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const submitButton = screen.getByText('Войти')

    // Пытаемся отправить форму с пустым email
    await act(async () => {
      await user.click(submitButton)
    })

    // Проверяем, что браузерная валидация сработала
    expect(emailInput).toBeInvalid()
  })

  // Новые тесты

  it('handles "Не помню пароль" link click', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const forgotPasswordLink = screen.getByText('Не помню пароль')
    
    // Проверяем, что это ссылка
    expect(forgotPasswordLink.tagName.toLowerCase()).toBe('a')
    
    // Проверяем наличие компонента без проверки конкретных стилей
    expect(forgotPasswordLink).toBeInTheDocument()
  })

  it('validates password field', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByText('Войти')

    // Заполняем только email
    await act(async () => {
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
    })

    // Проверяем, что браузерная валидация сработала
    expect(passwordInput).toBeInvalid()
  })

  it('disables inputs during form submission', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByText('Войти')

    await act(async () => {
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
    })

    // Проверяем, что все поля ввода заблокированы во время отправки
    await waitFor(() => {
      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })
  })

  it('clears error message on new login attempt', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByText('Войти')

    // Первая попытка - неудачная
    await act(async () => {
      await user.type(emailInput, 'wrong@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)
    })

    // Ждем появления ошибки
    await waitFor(() => {
      expect(screen.getByText(/неверные учетные данные/i)).toBeInTheDocument()
    })

    // Вторая попытка - проверяем, что ошибка исчезает
    await act(async () => {
      await user.clear(emailInput)
      await user.clear(passwordInput)
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
    })

    // Проверяем, что ошибка исчезла
    await waitFor(() => {
      expect(screen.queryByText(/неверные учетные данные/i)).not.toBeInTheDocument()
    })
  })
}) 
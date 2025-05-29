import { render } from '@testing-library/react'
import { UserProvider } from '../contexts/UserContext'
import { TasksProvider } from '../contexts/TasksContext'

// Кастомный рендер с провайдерами
export function renderWithProviders(ui, options = {}) {
  return render(
    <UserProvider>
      <TasksProvider>
        {ui}
      </TasksProvider>
    </UserProvider>,
    options
  )
}

// Мок для успешного ответа API
export const mockSuccessResponse = (data) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  })
}

// Мок для ошибки API
export const mockErrorResponse = (status = 400, message = 'Error') => {
  return Promise.reject({
    status,
    message,
  })
}

// Хелпер для ожидания асинхронных действий
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Мок для localStorage
export const mockLocalStorage = () => {
  const store = {}
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      Object.keys(store).forEach(key => {
        delete store[key]
      })
    },
  }
} 
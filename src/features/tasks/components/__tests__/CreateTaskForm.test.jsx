import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateTaskForm from '../CreateTaskForm'
import { useUser } from '@/contexts/UserContext'

// Мокаем константы
const STATUS_OPTIONS_MAP = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  FAILED: 'failed'
}

vi.mock('@/constants', () => ({
  STATUS_OPTIONS_MAP: {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
    FAILED: 'failed'
  }
}))

// Мок для TaskFormBase
vi.mock('../TaskFormBase', () => ({
  default: ({ initialTaskData, onSubmitForm, onCloseForm, isUpdateForm, loggedInUser }) => (
    <div data-testid="task-form-base">
      <div>Mock TaskFormBase</div>
      <button onClick={() => onSubmitForm({
        ...initialTaskData,
        priority: 'normal',
        difficulty: 2
      })}>Submit</button>
      <button onClick={onCloseForm}>Close</button>
      <div data-testid="initial-data">{JSON.stringify(initialTaskData)}</div>
      <div data-testid="is-update">{isUpdateForm.toString()}</div>
      <div data-testid="user-data">{JSON.stringify(loggedInUser)}</div>
    </div>
  )
}))

// Мок для UserContext
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com'
}

// Мок для TasksContext
const mockAddTask = vi.fn()
vi.mock('@/contexts/TasksContext', () => ({
  useTasks: () => ({ addTask: mockAddTask })
}))

vi.mock('@/contexts/UserContext', () => ({
  useUser: vi.fn()
}))

describe('CreateTaskForm', () => {
  const defaultProps = {
    onClose: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Устанавливаем дефолтное значение для useUser
    useUser.mockReturnValue({
      user: mockUser,
      isLoadingUser: false,
      userError: null
    })
  })

  it('renders TaskFormBase with correct initial props', () => {
    render(<CreateTaskForm {...defaultProps} />)
    
    // Проверяем, что форма отрендерена
    expect(screen.getByTestId('task-form-base')).toBeInTheDocument()
    
    // Проверяем начальные данные
    const initialData = JSON.parse(screen.getByTestId('initial-data').textContent)
    expect(initialData).toEqual(expect.objectContaining({
      title: '',
      description: '',
      sphere: '',
      deadline: '',
      duration: 3600,
      fastDoneBonus: 0,
      combo: false,
      rewardXp: 100,
      rewardCurrency: 10,
      linkedTaskId: 0
    }))
    
    // Проверяем, что это не форма обновления
    expect(screen.getByTestId('is-update').textContent).toBe('false')
    
    // Проверяем данные пользователя
    const userData = JSON.parse(screen.getByTestId('user-data').textContent)
    expect(userData).toEqual(mockUser)
  })

  it('calls addTask with correct data when form is submitted', async () => {
    const user = userEvent.setup()
    mockAddTask.mockResolvedValueOnce({}) // Мокаем успешный ответ

    render(<CreateTaskForm {...defaultProps} />)
    
    // Симулируем отправку формы
    await user.click(screen.getByText('Submit'))
    
    // Проверяем, что addTask был вызван с правильными данными
    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith({
        title: '',
        description: '',
        sphere: '',
        deadline: '',
        duration: 3600,
        fastDoneBonus: 0,
        combo: false,
        rewardXp: 100,
        rewardCurrency: 10,
        linkedTaskId: 0,
        priority: 'normal',
        difficulty: 2,
        status: STATUS_OPTIONS_MAP.NEW,
        author: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email
        },
        executor: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email
        }
      })
    })
    
    // Проверяем, что форма была закрыта
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('shows loading state when user is not available', () => {
    // Переопределяем мок для UserContext для этого теста
    useUser.mockReturnValueOnce({
      user: null,
      isLoadingUser: false,
      userError: null
    })
    
    render(<CreateTaskForm {...defaultProps} />)
    
    expect(screen.getByText('Загрузка данных пользователя...')).toBeInTheDocument()
  })

  it('handles error when adding task fails', async () => {
    const user = userEvent.setup()
    // Мокаем console.error для проверки ошибки
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Мокаем addTask чтобы он возвращал ошибку
    const error = new Error('Failed to add task')
    mockAddTask.mockRejectedValueOnce(error)
    
    render(<CreateTaskForm {...defaultProps} />)
    
    // Симулируем отправку формы
    await user.click(screen.getByText('Submit'))
    
    // Проверяем, что ошибка была залогирована
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'CreateTaskForm: Failed to add task',
        error
      )
    })
    
    // Проверяем, что форма не была закрыта при ошибке
    expect(defaultProps.onClose).not.toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('closes form when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm {...defaultProps} />)
    
    await user.click(screen.getByText('Close'))
    
    expect(defaultProps.onClose).toHaveBeenCalled()
  })
}) 
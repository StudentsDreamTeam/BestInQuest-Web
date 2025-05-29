import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { TasksProvider, useTasks } from '../TasksContext'
import { useUser } from '../UserContext'
import * as taskApi from '../../features/tasks/services/taskApi'
import { STATUS_OPTIONS_MAP } from '../../constants'

// Мок UserContext
vi.mock('../UserContext', () => ({
  useUser: vi.fn()
}))

// Мок API функций с добавленными задержками для имитации реальных условий
vi.mock('../../features/tasks/services/taskApi', () => ({
  fetchTasksByUserId: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  updateTaskStatus: vi.fn()
}))

// Компонент для тестирования хука useTasks
const TestComponent = ({ onTasksChange }) => {
  const tasksContext = useTasks()
  onTasksChange?.(tasksContext)
  return null
}

describe('TasksContext', () => {
  const mockUser = {
    id: 1,
    name: 'Test User'
  }

  const mockTasks = [
    {
      id: 1,
      title: 'Test Task 1',
      status: STATUS_OPTIONS_MAP.NEW,
      updateDate: '2024-03-20T12:00:00.000Z'
    },
    {
      id: 2,
      title: 'Test Task 2',
      status: STATUS_OPTIONS_MAP.DONE,
      updateDate: '2024-03-20T11:00:00.000Z'
    }
  ]

  let contextValue = null
  const renderComponent = () => {
    render(
      <TasksProvider>
        <TestComponent onTasksChange={(value) => { contextValue = value }} />
      </TasksProvider>
    )
    return contextValue
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useUser.mockReturnValue({ user: mockUser, isLoadingUser: false })
    taskApi.fetchTasksByUserId.mockResolvedValue(mockTasks)
    contextValue = null
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Initialization', () => {
    it('initializes with empty state', () => {
      renderComponent()
      expect(contextValue.tasks).toEqual([])
      expect(contextValue.isLoadingTasks).toBe(true)
      expect(contextValue.tasksError).toBe(null)
    })

    it('handles case when user is not available', async () => {
      useUser.mockReturnValue({ user: null, isLoadingUser: false })
      renderComponent()
      
      await waitFor(() => {
        expect(contextValue.tasksError).toBe('Не удалось загрузить задачи: пользователь не определен.')
        expect(contextValue.tasks).toEqual([])
        expect(contextValue.isLoadingTasks).toBe(false)
      })
    })

    it('waits for user to load before loading tasks', () => {
      useUser.mockReturnValue({ user: null, isLoadingUser: true })
      renderComponent()
      
      expect(taskApi.fetchTasksByUserId).not.toHaveBeenCalled()
      expect(contextValue.isLoadingTasks).toBe(true)
    })
  })

  describe('Task Loading', () => {
    it('loads tasks when user becomes available', async () => {
      renderComponent()

      await waitFor(() => {
        expect(contextValue.tasks).toEqual(mockTasks)
        expect(contextValue.isLoadingTasks).toBe(false)
        expect(contextValue.tasksError).toBe(null)
      })

      expect(taskApi.fetchTasksByUserId).toHaveBeenCalledWith(mockUser.id)
    })

    it('handles network errors during task loading', async () => {
      const error = new Error('Network error')
      taskApi.fetchTasksByUserId.mockRejectedValue(error)

      renderComponent()

      await waitFor(() => {
        expect(contextValue.tasksError).toBe(error.message)
        expect(contextValue.tasks).toEqual([])
        expect(contextValue.isLoadingTasks).toBe(false)
      })
    })

    it('can reload tasks on demand', async () => {
      renderComponent()

      await waitFor(() => {
        expect(contextValue.tasks).toEqual(mockTasks)
      })

      // Очищаем предыдущие вызовы
      taskApi.fetchTasksByUserId.mockClear()

      // Вызываем перезагрузку
      await contextValue.reloadTasks()

      expect(taskApi.fetchTasksByUserId).toHaveBeenCalledWith(mockUser.id)
    })
  })

  describe('Task Operations', () => {
    describe('Adding Tasks', () => {
      it('successfully adds a new task', async () => {
        const newTask = {
          id: 3,
          title: 'New Task',
          status: STATUS_OPTIONS_MAP.NEW,
          updateDate: '2024-03-20T13:00:00.000Z'
        }
        taskApi.createTask.mockResolvedValue(newTask)

        renderComponent()
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks))

        await contextValue.addTask({ title: 'New Task' })

        expect(taskApi.createTask).toHaveBeenCalledWith(
          { title: 'New Task' },
          mockUser.id
        )
        expect(contextValue.tasks[0]).toEqual(newTask)
      })

      it('handles errors when adding task', async () => {
        const error = new Error('Failed to create task')
        taskApi.createTask.mockRejectedValue(error)

        renderComponent()
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks))

        await expect(contextValue.addTask({ title: 'New Task' }))
          .rejects.toThrow('Failed to create task')

        expect(contextValue.tasksError).toBe(error.message)
      })

      it('requires user to be available for adding task', async () => {
        useUser.mockReturnValue({ user: null, isLoadingUser: false })
        renderComponent()

        await expect(contextValue.addTask({ title: 'New Task' }))
          .rejects.toThrow('Cannot create task: user not available.')
      })
    })

    describe('Status Toggle', () => {
      it('successfully toggles task status', async () => {
        const updatedTask = {
          ...mockTasks[0],
          status: STATUS_OPTIONS_MAP.DONE,
          updateDate: '2024-03-20T14:00:00.000Z'
        }
        taskApi.updateTaskStatus.mockResolvedValue(updatedTask)

        renderComponent()
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks))

        await contextValue.toggleTaskStatus(1, STATUS_OPTIONS_MAP.NEW)

        expect(taskApi.updateTaskStatus).toHaveBeenCalledWith(
          1,
          expect.objectContaining({ status: STATUS_OPTIONS_MAP.DONE }),
          mockUser.id
        )

        // Проверяем оптимистичное обновление и финальное состояние
        expect(contextValue.tasks[0]).toEqual(updatedTask)
      })

      it('reverts optimistic update on error', async () => {
        const error = new Error('Failed to update status')
        taskApi.updateTaskStatus.mockRejectedValue(error)

        renderComponent()
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks))

        const originalStatus = mockTasks[0].status
        await contextValue.toggleTaskStatus(1, originalStatus)

        expect(contextValue.tasksError).toBe(error.message)
        expect(contextValue.tasks[0].status).toBe(originalStatus)
      })
    })
  })
}) 
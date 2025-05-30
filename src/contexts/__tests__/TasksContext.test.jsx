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

    it('does not reload tasks if user is not available', async () => {
      useUser.mockReturnValue({ user: null, isLoadingUser: false });
      renderComponent();
      // Убедимся, что начальная ошибка установлена из-за отсутствия пользователя
      await waitFor(() => {
        expect(contextValue.tasksError).toBe('Не удалось загрузить задачи: пользователь не определен.');
      });

      taskApi.fetchTasksByUserId.mockClear(); // Очищаем мок перед вызовом reloadTasks

      await contextValue.reloadTasks();

      expect(taskApi.fetchTasksByUserId).not.toHaveBeenCalled();
    });
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
        await waitFor(() => {
          expect(contextValue.tasks[0]).toEqual(newTask)
        })
      })

      it('handles errors when adding task', async () => {
        const error = new Error('Failed to create task')
        taskApi.createTask.mockRejectedValue(error)

        renderComponent()
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks))

        await expect(contextValue.addTask({ title: 'New Task' }))
          .rejects.toThrow('Failed to create task')

        await waitFor(() => {
          expect(contextValue.tasksError).toBe(error.message)
        })
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

        await waitFor(() => {
          expect(contextValue.tasks[0]).toEqual(updatedTask)
        })
      })

      it('reverts optimistic update on error', async () => {
        const error = new Error('Failed to update status')
        taskApi.updateTaskStatus.mockRejectedValue(error)

        renderComponent()
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks))

        const originalStatus = mockTasks[0].status
        await contextValue.toggleTaskStatus(1, originalStatus)

        await waitFor(() => {
          expect(contextValue.tasksError).toBe(error.message)
          expect(contextValue.tasks[0].status).toBe(originalStatus)
        })
      })

      it('warns if user is not available when toggling status', async () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn');
        useUser.mockReturnValue({ user: null, isLoadingUser: false });
        renderComponent();
        // Не нужно ждать загрузки задач, так как пользователь null

        await contextValue.toggleTaskStatus(1, STATUS_OPTIONS_MAP.NEW);
        expect(consoleWarnSpy).toHaveBeenCalledWith('Cannot toggle task status: user not available.');
        consoleWarnSpy.mockRestore();
      })

      it('warns if task is not found when toggling status', async () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn');
        renderComponent();
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks));

        await contextValue.toggleTaskStatus(999, STATUS_OPTIONS_MAP.NEW); // Non-existent ID
        expect(consoleWarnSpy).toHaveBeenCalledWith('Cannot toggle task status: task 999 not found.');
        consoleWarnSpy.mockRestore();
      })
    })

    describe('Updating Tasks', () => {
      it('successfully updates a task', async () => {
        renderComponent();
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks));

        const taskToUpdate = mockTasks[0];
        const updates = { title: 'Updated Title' };
        const expectedUpdatedTask = {
          ...taskToUpdate,
          ...updates,
          updateDate: expect.any(String), // updateDate будет новой
        };
        // Мок API должен вернуть задачу с новой updateDate
        taskApi.updateTask.mockImplementation(async (taskId, data) => ({
          ...taskToUpdate,
          ...data,
          updateDate: new Date().toISOString(), // Имитируем обновление даты сервером
        }));

        await contextValue.updateTask(taskToUpdate.id, updates);

        expect(taskApi.updateTask).toHaveBeenCalledWith(
          taskToUpdate.id,
          expect.objectContaining(updates),
          mockUser.id
        );
        await waitFor(() => {
          const updatedTaskInState = contextValue.tasks.find(t => t.id === taskToUpdate.id);
          expect(updatedTaskInState).toEqual(expectedUpdatedTask);
        });
        expect(contextValue.tasksError).toBeNull();
      });

      it('throws error if user is not available when updating task', async () => {
        useUser.mockReturnValue({ user: null, isLoadingUser: false });
        renderComponent();
        await expect(contextValue.updateTask(1, { title: 'Test' }))
          .rejects.toThrow('Cannot update task: user not available.');
      });

      it('throws error if task to update is not found', async () => {
        renderComponent();
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks));

        await expect(contextValue.updateTask(999, { title: 'Test' })) // Non-existent ID
          .rejects.toThrow('Task with ID 999 not found for update.');
      });

      it('handles errors when API call fails during update', async () => {
        renderComponent();
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks));

        const error = new Error('Failed to update task');
        taskApi.updateTask.mockRejectedValue(error);
        const taskToUpdate = mockTasks[0];

        await expect(contextValue.updateTask(taskToUpdate.id, { title: 'New Title' }))
          .rejects.toThrow(error.message);

        await waitFor(() => {
          expect(contextValue.tasksError).toBe(error.message);
        });
        // Убедимся, что задача не изменилась в состоянии
        const taskInState = contextValue.tasks.find(t => t.id === taskToUpdate.id);
        expect(taskInState.title).toBe(taskToUpdate.title); 
      });
    });

    describe('Deleting Tasks', () => {
      it('successfully deletes a task', async () => {
        renderComponent();
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks));

        const taskToDelete = mockTasks[0];
        taskApi.deleteTask.mockResolvedValue({}); // API подтверждает удаление

        await contextValue.deleteTask(taskToDelete.id);

        expect(taskApi.deleteTask).toHaveBeenCalledWith(taskToDelete.id, mockUser.id);
        await waitFor(() => {
          expect(contextValue.tasks.find(t => t.id === taskToDelete.id)).toBeUndefined();
          expect(contextValue.tasks.length).toBe(mockTasks.length - 1);
        });
        expect(contextValue.tasksError).toBeNull();
      });

      it('throws error if user is not available when deleting task', async () => {
        useUser.mockReturnValue({ user: null, isLoadingUser: false });
        renderComponent();
        await expect(contextValue.deleteTask(1))
          .rejects.toThrow('Cannot delete task: user not available.');
      });

      it('handles errors when API call fails during delete', async () => {
        renderComponent();
        await waitFor(() => expect(contextValue.tasks).toEqual(mockTasks));

        const error = new Error('Failed to delete task');
        taskApi.deleteTask.mockRejectedValue(error);
        const taskToDelete = mockTasks[0];

        await expect(contextValue.deleteTask(taskToDelete.id))
          .rejects.toThrow(error.message);

        await waitFor(() => {
          expect(contextValue.tasksError).toBe(error.message);
        });
        // Убедимся, что задача все еще на месте
        expect(contextValue.tasks.find(t => t.id === taskToDelete.id)).toBeDefined();
        expect(contextValue.tasks.length).toBe(mockTasks.length);
      });
    });
  })
}) 
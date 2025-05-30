import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskList from '../TaskList'

// Мокаем компонент Task
vi.mock('../Task', () => ({
  default: ({ task, onOpenUpdateModal, onOpenDeleteConfirmModal }) => (
    <div data-testid="task-item" data-task-id={task.id}>
      {task.title}
      <button onClick={() => onOpenUpdateModal(task)}>Update</button>
      <button onClick={() => onOpenDeleteConfirmModal(task.id)}>Delete</button>
    </div>
  )
}))

// Мокаем контекст задач
const mockTasks = [
  { id: '1', title: 'Task 1' },
  { id: '2', title: 'Task 2' },
  { id: '3', title: 'Task 3' }
]

const mockTasksContext = {
  tasks: mockTasks,
  isLoadingTasks: false,
  tasksError: null
}

vi.mock('../../../../contexts/TasksContext', () => ({
  useTasks: () => mockTasksContext
}))

describe('TaskList', () => {
  const defaultProps = {
    onOpenUpdateTaskModal: vi.fn(),
    onOpenDeleteConfirmModal: vi.fn()
  }

  it('renders list of tasks', () => {
    render(<TaskList {...defaultProps} />)

    // Проверяем, что все задачи отрендерены
    const taskElements = screen.getAllByTestId('task-item')
    expect(taskElements).toHaveLength(mockTasks.length)

    // Проверяем содержимое каждой задачи
    mockTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument()
    })
  })

  it('shows loading message when tasks are loading', () => {
    mockTasksContext.isLoadingTasks = true
    render(<TaskList {...defaultProps} />)

    expect(screen.getByText('Загрузка задач...')).toBeInTheDocument()
    mockTasksContext.isLoadingTasks = false
  })

  it('shows error message when loading fails', () => {
    const errorMessage = 'Failed to load tasks'
    mockTasksContext.tasksError = errorMessage
    render(<TaskList {...defaultProps} />)

    expect(screen.getByText(`Ошибка загрузки задач: ${errorMessage}`)).toBeInTheDocument()
    mockTasksContext.tasksError = null
  })

  it('shows empty message when there are no tasks', () => {
    mockTasksContext.tasks = []
    render(<TaskList {...defaultProps} />)

    expect(screen.getByText('Задач пока нет.')).toBeInTheDocument()
    mockTasksContext.tasks = mockTasks
  })

  it('passes correct props to Task components', () => {
    render(<TaskList {...defaultProps} />)

    // Проверяем, что каждый Task получил правильный id
    const taskElements = screen.getAllByTestId('task-item')
    taskElements.forEach((element, index) => {
      expect(element).toHaveAttribute('data-task-id', mockTasks[index].id)
    })
  })

  it('handles task update modal opening', async () => {
    const onOpenUpdateTaskModal = vi.fn()
    render(<TaskList {...defaultProps} onOpenUpdateTaskModal={onOpenUpdateTaskModal} />)

    // Кликаем по кнопке Update первой задачи
    const updateButtons = screen.getAllByText('Update')
    updateButtons[0].click()

    expect(onOpenUpdateTaskModal).toHaveBeenCalledWith(mockTasks[0])
  })

  it('handles task deletion modal opening', async () => {
    const onOpenDeleteConfirmModal = vi.fn()
    render(<TaskList {...defaultProps} onOpenDeleteConfirmModal={onOpenDeleteConfirmModal} />)

    // Кликаем по кнопке Delete первой задачи
    const deleteButtons = screen.getAllByText('Delete')
    deleteButtons[0].click()

    expect(onOpenDeleteConfirmModal).toHaveBeenCalledWith(mockTasks[0].id)
  })
}) 
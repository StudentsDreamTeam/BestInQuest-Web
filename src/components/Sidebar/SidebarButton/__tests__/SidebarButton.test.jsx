import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SidebarButton from '../SidebarButton'

// Мокаем SVG компоненты
vi.mock('@/assets/icons/FilterIcon19.svg', () => ({
  ReactComponent: () => <div data-testid="filter-icon">Filter Icon</div>
}))

vi.mock('@/assets/icons/PlusIcon19.svg', () => ({
  ReactComponent: () => <div data-testid="plus-icon">Plus Icon</div>
}))

describe('SidebarButton', () => {
  it('renders filter button correctly', () => {
    render(
      <SidebarButton buttonType="filter">
        Filter Tasks
      </SidebarButton>
    )

    expect(screen.getByText('Filter Tasks')).toBeInTheDocument()
    expect(screen.getByTestId('filter-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument()
  })

  it('renders add task button correctly', () => {
    render(
      <SidebarButton buttonType="addTask">
        Add Task
      </SidebarButton>
    )

    expect(screen.getByText('Add Task')).toBeInTheDocument()
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('filter-icon')).not.toBeInTheDocument()
  })

  it('applies correct classes for filter button', () => {
    const { rerender } = render(
      <SidebarButton buttonType="filter">
        Filter Tasks
      </SidebarButton>
    )

    let button = screen.getByRole('button')
    expect(button).toHaveClass('button')
    expect(button).not.toHaveClass('addTask')
    expect(button).not.toHaveClass('active')

    // Проверяем активное состояние
    rerender(
      <SidebarButton buttonType="filter" isActive={true}>
        Filter Tasks
      </SidebarButton>
    )

    button = screen.getByRole('button')
    expect(button).toHaveClass('button', 'active')
    expect(button).not.toHaveClass('addTask')
  })

  it('applies correct classes for add task button', () => {
    const { rerender } = render(
      <SidebarButton buttonType="addTask">
        Add Task
      </SidebarButton>
    )

    let button = screen.getByRole('button')
    expect(button).toHaveClass('button', 'addTask')
    expect(button).not.toHaveClass('active')

    // Проверяем активное состояние
    rerender(
      <SidebarButton buttonType="addTask" isActive={true}>
        Add Task
      </SidebarButton>
    )

    button = screen.getByRole('button')
    expect(button).toHaveClass('button', 'active')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <SidebarButton buttonType="filter" onClick={handleClick}>
        Filter Tasks
      </SidebarButton>
    )

    const button = screen.getByRole('button')
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies styles for different states', () => {
    const { rerender } = render(
      <SidebarButton buttonType="filter">
        Filter Tasks
      </SidebarButton>
    )

    let button = screen.getByRole('button')
    
    // Проверяем базовые классы
    expect(button).toHaveClass('button')
    expect(button).not.toHaveClass('active')

    // Проверяем активное состояние
    rerender(
      <SidebarButton buttonType="filter" isActive={true}>
        Filter Tasks
      </SidebarButton>
    )

    button = screen.getByRole('button')
    expect(button).toHaveClass('button', 'active')
  })

  it('applies correct classes for addTask type', () => {
    render(
      <SidebarButton buttonType="addTask">
        Add Task
      </SidebarButton>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('button', 'addTask')
  })
}) 
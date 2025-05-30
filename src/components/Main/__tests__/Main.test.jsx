import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Main from '../Main'

// Мокаем компоненты, которые использует Main
vi.mock('../Header/Header.jsx', () => ({
  default: ({ title }) => <div data-testid="header">{title}</div>
}))

vi.mock('../../../features/tasks/components/TaskList', () => ({
  default: ({ onOpenUpdateTaskModal, onOpenDeleteConfirmModal }) => (
    <div data-testid="task-list">
      TaskList Component
      <button onClick={() => onOpenUpdateTaskModal()}>Update Task</button>
      <button onClick={() => onOpenDeleteConfirmModal()}>Delete Task</button>
    </div>
  )
}))

vi.mock('../../../features/user/components/UserProfilePage', () => ({
  default: () => <div data-testid="user-profile-page">UserProfilePage Component</div>
}))

vi.mock('../../../features/achievements/components/AchievementsPage', () => ({
  default: () => <div data-testid="achievements-page">AchievementsPage Component</div>
}))

vi.mock('../../../features/shop/components/ShopPage', () => ({
  default: () => <div data-testid="shop-page">ShopPage Component</div>
}))

describe('Main', () => {
  const defaultProps = {
    active: 'Сегодня',
    onOpenUpdateTaskModal: vi.fn(),
    onOpenDeleteConfirmModal: vi.fn()
  }

  it('renders header with correct title for task pages', () => {
    render(<Main {...defaultProps} />)
    
    expect(screen.getByTestId('header')).toHaveTextContent('Сегодня')
  })

  it('does not render header for profile, achievements and shop pages', () => {
    const pages = ['Профиль', 'Достижения', 'Магазин']
    
    pages.forEach(page => {
      const { rerender } = render(<Main {...defaultProps} active={page} />)
      expect(screen.queryByTestId('header')).not.toBeInTheDocument()
      rerender(<div />) // Очищаем DOM перед следующим рендером
    })
  })

  it('renders TaskList component when active is "Сегодня"', () => {
    render(<Main {...defaultProps} />)
    
    expect(screen.getByTestId('task-list')).toBeInTheDocument()
  })

  it('renders UserProfilePage when active is "Профиль"', () => {
    render(<Main {...defaultProps} active="Профиль" />)
    
    expect(screen.getByTestId('user-profile-page')).toBeInTheDocument()
  })

  it('renders AchievementsPage when active is "Достижения"', () => {
    render(<Main {...defaultProps} active="Достижения" />)
    
    expect(screen.getByTestId('achievements-page')).toBeInTheDocument()
  })

  it('renders ShopPage when active is "Магазин"', () => {
    render(<Main {...defaultProps} active="Магазин" />)
    
    expect(screen.getByTestId('shop-page')).toBeInTheDocument()
  })

  it('handles task modal actions correctly', async () => {
    const onOpenUpdateTaskModal = vi.fn()
    const onOpenDeleteConfirmModal = vi.fn()

    render(
      <Main 
        {...defaultProps} 
        onOpenUpdateTaskModal={onOpenUpdateTaskModal}
        onOpenDeleteConfirmModal={onOpenDeleteConfirmModal}
      />
    )
    
    // Проверяем, что модальные окна открываются при клике на соответствующие кнопки
    screen.getByText('Update Task').click()
    expect(onOpenUpdateTaskModal).toHaveBeenCalled()

    screen.getByText('Delete Task').click()
    expect(onOpenDeleteConfirmModal).toHaveBeenCalled()
  })
}) 
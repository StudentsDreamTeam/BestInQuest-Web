import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from '../Sidebar'

// Мок для хука useUser
vi.mock('../../../contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'test-avatar.jpg',
      level: 1,
      xp: 100
    },
    isLoadingUser: false,
    userError: null
  })
}))

// Мок для SVG компонентов
vi.mock('../../../assets/icons/FilterIcon19.svg', () => ({
  ReactComponent: () => <div data-testid="filter-icon">Filter Icon</div>
}))

vi.mock('../../../assets/icons/PlusIcon19.svg', () => ({
  ReactComponent: () => <div data-testid="plus-icon">Plus Icon</div>
}))

vi.mock('../../../assets/icons/StarIcon.svg', () => ({
  ReactComponent: () => <div data-testid="star-icon">Star Icon</div>
}))

describe('Sidebar', () => {
  const defaultMenuItems = ['Все задачи', 'Важные', 'Выполненные', 'Добавить задачу']

  const renderSidebar = (props = {}) => {
    const defaultProps = {
      activeMenuItem: null,
      onMenuItemChange: vi.fn(),
      onProfileClick: vi.fn(),
      menuItems: defaultMenuItems,
      ...props
    }

    return render(<Sidebar {...defaultProps} />)
  }

  it('renders user profile and menu', () => {
    renderSidebar()

    // Проверяем наличие профиля пользователя
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('1 уровень')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()

    // Проверяем наличие всех пунктов меню
    defaultMenuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('handles profile click correctly', async () => {
    const onProfileClick = vi.fn()
    const user = userEvent.setup()

    renderSidebar({ onProfileClick })

    // Кликаем по профилю пользователя
    await user.click(screen.getByTestId('user-profile'))
    expect(onProfileClick).toHaveBeenCalled()
  })

  it('handles menu item changes correctly', async () => {
    const onMenuItemChange = vi.fn()
    const user = userEvent.setup()

    renderSidebar({ onMenuItemChange })

    // Кликаем по пункту меню
    await user.click(screen.getByText('Важные'))
    expect(onMenuItemChange).toHaveBeenCalledWith('Важные')
  })

  it('highlights active menu item correctly', () => {
    renderSidebar({ activeMenuItem: 'Важные' })

    // Находим все кнопки меню
    const buttons = screen.getAllByRole('button')
    
    // Проверяем, что только кнопка "Важные" активна
    buttons.forEach(button => {
      if (button.textContent.includes('Важные')) {
        expect(button).toHaveClass('active')
      } else {
        expect(button).not.toHaveClass('active')
      }
    })
  })
}) 
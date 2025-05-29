import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SidebarUserProfile from '../SidebarUserProfile'

// Мок для SVG компонента
vi.mock('../../../../assets/icons/StarIcon.svg', () => ({
  ReactComponent: () => <div data-testid="star-icon">Star Icon</div>
}))

describe('SidebarUserProfile', () => {
  const mockUser = {
    name: 'Test User',
    level: 5,
    xp: 1000,
    avatar: 'test-avatar.jpg'
  }

  it('renders user profile correctly with all data', () => {
    render(
      <SidebarUserProfile
        user={mockUser}
        isActive={false}
        onClick={() => {}}
      />
    )

    // Проверяем отображение данных пользователя
    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(`${mockUser.level} уровень`)).toBeInTheDocument()
    expect(screen.getByText(mockUser.xp.toString())).toBeInTheDocument()
    
    // Проверяем наличие иконки звезды
    expect(screen.getByTestId('star-icon')).toBeInTheDocument()
    
    // Проверяем аватар
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar.src).toContain(mockUser.avatar)
  })

  it('renders loading state when no user provided', () => {
    render(
      <SidebarUserProfile
        user={null}
        isActive={false}
        onClick={() => {}}
      />
    )

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('uses default avatar when user avatar is not provided', () => {
    const userWithoutAvatar = { ...mockUser, avatar: null }
    render(
      <SidebarUserProfile
        user={userWithoutAvatar}
        isActive={false}
        onClick={() => {}}
      />
    )

    const avatar = screen.getByAltText('User Avatar')
    expect(avatar.src).toContain('userAvatar.png')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <SidebarUserProfile
        user={mockUser}
        isActive={false}
        onClick={handleClick}
      />
    )

    await user.click(screen.getByText(mockUser.name))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies active styles when isActive is true', () => {
    const { rerender } = render(
      <SidebarUserProfile
        user={mockUser}
        isActive={true}
        onClick={() => {}}
      />
    )

    // Проверяем, что компонент имеет правильный атрибут $isActive
    const wrapper = screen.getByTestId('user-profile')
    expect(wrapper).toHaveAttribute('data-active', 'true')

    // Проверяем неактивное состояние
    rerender(
      <SidebarUserProfile
        user={mockUser}
        isActive={false}
        onClick={() => {}}
      />
    )
    expect(wrapper).toHaveAttribute('data-active', 'false')
  })

  it('displays 0 XP when xp is not provided', () => {
    const userWithoutXP = { ...mockUser, xp: null }
    render(
      <SidebarUserProfile
        user={userWithoutXP}
        isActive={false}
        onClick={() => {}}
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })
}) 
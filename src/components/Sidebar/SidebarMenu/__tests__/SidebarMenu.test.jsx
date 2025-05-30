import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SidebarMenu from '../SidebarMenu'

// Мокаем SVG компоненты, которые использует SidebarButton
vi.mock('../../../../assets/icons/FilterIcon19.svg', () => ({
  ReactComponent: () => <div data-testid="filter-icon">Filter Icon</div>
}))

vi.mock('../../../../assets/icons/PlusIcon19.svg', () => ({
  ReactComponent: () => <div data-testid="plus-icon">Plus Icon</div>
}))

describe('SidebarMenu', () => {
  const defaultMenuItems = ['Все задачи', 'Важные', 'Выполненные', 'Добавить задачу']

  it('renders all menu items correctly', () => {
    render(
      <SidebarMenu 
        menuItems={defaultMenuItems}
        active={null}
        onChange={() => {}}
      />
    )

    // Проверяем, что все пункты меню отрендерены
    defaultMenuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })

    // Проверяем, что для "Добавить задачу" используется правильная иконка
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    // Проверяем, что для остальных пунктов используется иконка фильтра
    expect(screen.getAllByTestId('filter-icon')).toHaveLength(3)
  })

  it('highlights active menu item', () => {
    render(
      <SidebarMenu 
        menuItems={defaultMenuItems}
        active="Важные"
        onChange={() => {}}
      />
    )

    // Находим все кнопки
    const buttons = screen.getAllByRole('button')
    
    // Проверяем, что только кнопка "Важные" имеет класс active
    buttons.forEach(button => {
      if (button.textContent.includes('Важные')) {
        expect(button).toHaveClass('active')
      } else {
        expect(button).not.toHaveClass('active')
      }
    })
  })

  it('calls onChange with correct item when clicked', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(
      <SidebarMenu 
        menuItems={defaultMenuItems}
        active={null}
        onChange={handleChange}
      />
    )

    // Кликаем по пункту "Важные"
    await user.click(screen.getByText('Важные'))
    expect(handleChange).toHaveBeenCalledWith('Важные')

    // Кликаем по пункту "Добавить задачу"
    await user.click(screen.getByText('Добавить задачу'))
    expect(handleChange).toHaveBeenCalledWith('Добавить задачу')
  })

  it('applies correct button type for "Добавить задачу"', () => {
    render(
      <SidebarMenu 
        menuItems={defaultMenuItems}
        active={null}
        onChange={() => {}}
      />
    )

    // Находим кнопку "Добавить задачу"
    const addTaskButton = screen.getByText('Добавить задачу').closest('button')
    expect(addTaskButton).toHaveClass('addTask')

    // Проверяем, что остальные кнопки не имеют класс addTask
    const otherButtons = defaultMenuItems
      .filter(item => item !== 'Добавить задачу')
      .map(item => screen.getByText(item).closest('button'))
    
    otherButtons.forEach(button => {
      expect(button).not.toHaveClass('addTask')
    })
  })

  it('renders empty menu when no items provided', () => {
    render(
      <SidebarMenu 
        menuItems={[]}
        active={null}
        onChange={() => {}}
      />
    )

    // Проверяем, что в меню нет кнопок
    const buttons = screen.queryAllByRole('button')
    expect(buttons).toHaveLength(0)
  })

  it('handles null or undefined active item', () => {
    const { rerender } = render(
      <SidebarMenu 
        menuItems={defaultMenuItems}
        active={null}
        onChange={() => {}}
      />
    )

    // Проверяем, что ни одна кнопка не активна при active={null}
    let buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).not.toHaveClass('active')
    })

    // Проверяем то же самое для undefined
    rerender(
      <SidebarMenu 
        menuItems={defaultMenuItems}
        active={undefined}
        onChange={() => {}}
      />
    )

    buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).not.toHaveClass('active')
    })
  })
}) 
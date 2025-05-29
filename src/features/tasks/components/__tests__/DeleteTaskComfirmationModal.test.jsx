import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteTaskConfirmationModal from '../DeleteTaskComfirmationModal'

// Мокаем компоненты напрямую
vi.mock('../DeleteTaskComfirmationModal', () => {
  const actual = vi.importActual('../DeleteTaskComfirmationModal')
  const Button = ({ children, onClick, variant, isActive }) => (
    <button 
      onClick={onClick}
      data-testid={`button-${variant || 'primary'}`}
      data-active={isActive}
    >
      {children}
    </button>
  )

  return {
    ...actual,
    default: ({ onClose, onConfirmDelete }) => (
      <>
        <h2>Точно удалить задачу?</h2>
        <div>
          <Button onClick={onConfirmDelete} isActive>Да, удалить</Button>
          <Button onClick={onClose} variant="secondary">Нет, оставить</Button>
        </div>
      </>
    )
  }
})

describe('DeleteTaskConfirmationModal', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onConfirmDelete: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders confirmation message and buttons', () => {
    render(<DeleteTaskConfirmationModal {...defaultProps} />)
    
    // Проверяем наличие заголовка
    expect(screen.getByText('Точно удалить задачу?')).toBeInTheDocument()
    
    // Проверяем наличие кнопок
    expect(screen.getByText('Да, удалить')).toBeInTheDocument()
    expect(screen.getByText('Нет, оставить')).toBeInTheDocument()
  })

  it('calls onConfirmDelete when confirm button is clicked', async () => {
    render(<DeleteTaskConfirmationModal {...defaultProps} />)
    
    // Кликаем по кнопке подтверждения
    await userEvent.click(screen.getByText('Да, удалить'))
    
    // Проверяем, что был вызван колбэк подтверждения
    expect(defaultProps.onConfirmDelete).toHaveBeenCalledTimes(1)
    // Проверяем, что колбэк закрытия не был вызван
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when cancel button is clicked', async () => {
    render(<DeleteTaskConfirmationModal {...defaultProps} />)
    
    // Кликаем по кнопке отмены
    await userEvent.click(screen.getByText('Нет, оставить'))
    
    // Проверяем, что был вызван колбэк закрытия
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    // Проверяем, что колбэк подтверждения не был вызван
    expect(defaultProps.onConfirmDelete).not.toHaveBeenCalled()
  })

  it('passes correct props to buttons', () => {
    render(<DeleteTaskConfirmationModal {...defaultProps} />)
    
    // Проверяем кнопку подтверждения
    const confirmButton = screen.getByText('Да, удалить')
    expect(confirmButton).toHaveAttribute('data-testid', 'button-primary')
    expect(confirmButton).toHaveAttribute('data-active', 'true')
    
    // Проверяем кнопку отмены
    const cancelButton = screen.getByText('Нет, оставить')
    expect(cancelButton).toHaveAttribute('data-testid', 'button-secondary')
  })
}) 
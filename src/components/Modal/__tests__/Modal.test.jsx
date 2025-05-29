import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../Modal'

describe('Modal', () => {
  let modalRoot;
  let showModalMock;
  let closeMock;

  // Создаем div для портала перед каждым тестом
  beforeEach(() => {
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modal')
    document.body.appendChild(modalRoot)

    // Создаем моки для методов диалога
    showModalMock = vi.fn()
    closeMock = vi.fn()
    let isOpen = false;

    // Определяем свойства и методы для HTMLDialogElement
    Object.defineProperties(HTMLDialogElement.prototype, {
      showModal: {
        configurable: true,
        value: showModalMock
      },
      close: {
        configurable: true,
        value: closeMock
      },
      open: {
        configurable: true,
        get: () => isOpen,
        set: (value) => { isOpen = value }
      }
    })
  })

  // Удаляем div после каждого теста
  afterEach(() => {
    if (modalRoot) {
      document.body.removeChild(modalRoot)
    }
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders modal content when open', () => {
    render(
      <Modal open={true}>
        <div>Modal content</div>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
    expect(showModalMock).toHaveBeenCalled()
  })

  it('applies delete class when modelType is delete', () => {
    render(
      <Modal open={true} modelType="delete">
        <div>Delete modal</div>
      </Modal>
    )
    const dialog = screen.getByTestId('modal-dialog')
    expect(dialog.className).toContain('delete')
  })

  it('calls onCloseModal when dialog is closed', () => {
    const handleClose = vi.fn()
    render(
      <Modal open={true} onCloseModal={handleClose}>
        <div>Closeable modal</div>
      </Modal>
    )

    const dialog = screen.getByTestId('modal-dialog')
    dialog.dispatchEvent(new Event('close'))
    expect(handleClose).toHaveBeenCalled()
  })

  it('renders in portal', () => {
    render(
      <Modal open={true}>
        <div>Portal content</div>
      </Modal>
    )
    
    expect(modalRoot).toContainElement(screen.getByText('Portal content'))
  })

  it('handles modal state changes', () => {
    // Устанавливаем начальное состояние open = true
    const dialog = document.createElement('dialog')
    dialog.open = true
    
    const { rerender } = render(
      <Modal open={true}>
        <div>Modal content</div>
      </Modal>
    )

    expect(showModalMock).toHaveBeenCalled()

    // Сбрасываем счетчик вызовов
    showModalMock.mockClear()
    closeMock.mockClear()

    rerender(
      <Modal open={false}>
        <div>Modal content</div>
      </Modal>
    )

    // Проверяем, что close вызывается только если модальное окно было открыто
    expect(closeMock).toHaveBeenCalled()
  })

  it('does not show modal when initially closed', () => {
    render(
      <Modal open={false}>
        <div>Hidden content</div>
      </Modal>
    )
    
    const dialog = screen.getByTestId('modal-dialog')
    expect(showModalMock).not.toHaveBeenCalled()
  })

  it('cleans up event listeners on unmount', () => {
    const handleClose = vi.fn()
    const { unmount } = render(
      <Modal open={true} onCloseModal={handleClose}>
        <div>Cleanup test</div>
      </Modal>
    )

    const dialog = screen.getByTestId('modal-dialog')
    const removeEventListenerSpy = vi.spyOn(dialog, 'removeEventListener')

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('close', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
}) 
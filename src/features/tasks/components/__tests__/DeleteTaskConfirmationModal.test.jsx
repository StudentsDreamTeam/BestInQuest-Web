import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// Импорт исправлен на DeleteTaskConfirmationModal (если компонент тоже будет переименован)
// Если имя файла компонента останется DeleteTaskComfirmationModal, то тут должно быть ../DeleteTaskComfirmationModal
import DeleteTaskConfirmationModal from '../DeleteTaskComfirmationModal'; 

describe('DeleteTaskConfirmationModal Component', () => {
  let mockOnClose;
  let mockOnConfirmDelete;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockOnConfirmDelete = vi.fn();
  });

  it('renders the modal with title and buttons', () => {
    render(<DeleteTaskConfirmationModal onClose={mockOnClose} onConfirmDelete={mockOnConfirmDelete} />);

    expect(screen.getByText('Точно удалить задачу?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Да, удалить' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Нет, оставить' })).toBeInTheDocument();
  });

  it('calls onConfirmDelete when the confirm button is clicked', () => {
    render(<DeleteTaskConfirmationModal onClose={mockOnClose} onConfirmDelete={mockOnConfirmDelete} />);
    
    const confirmButton = screen.getByRole('button', { name: 'Да, удалить' });
    fireEvent.click(confirmButton);

    expect(mockOnConfirmDelete).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when the cancel button is clicked', () => {
    render(<DeleteTaskConfirmationModal onClose={mockOnClose} onConfirmDelete={mockOnConfirmDelete} />);
    
    const cancelButton = screen.getByRole('button', { name: 'Нет, оставить' });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirmDelete).not.toHaveBeenCalled();
  });
}); 
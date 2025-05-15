// src/components/DeleteTaskConfirmationModal/DeleteTaskConfirmationModal.jsx
import { styled } from 'styled-components';
import Button from '../Button/Button';

// ModalOverlay и ModalContent убраны, так как их роль выполняет Modal.jsx и его CSS

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
  text-align: center; // Добавлено для центрирования заголовка
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ConfirmButton = styled(Button)`
  background-color: #E9D8FF;
  color: #9747FF;
  flex: 1;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 10px;
  &:hover {
    background-color: #d3b9ff;
  }
`;

const CancelButton = styled(Button)`
  background-color: #fff;
  color: #9747FF;
  border: 1px solid #E9D8FF;
  flex: 1;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 10px;
  &:hover {
    background-color: #f5f0ff;
  }
`;


export default function DeleteTaskConfirmationModal({ isOpen, onClose, onConfirmDelete }) {
  // isOpen проп больше не нужен здесь, если модалка рендерится условно в Layout
  // Но если мы хотим сохранить компонент универсальным, то можно оставить.
  // Для текущей реализации с Modal в Layout, isOpen здесь не используется.
  // if (!isOpen) return null; // Эта проверка теперь делается в Layout для <Modal>

  return (
    <> {/* Обертка в фрагмент, так как ModalOverlay и ModalContent убраны */}
      <ModalTitle>Точно удалить задачу?</ModalTitle>
      <ButtonGroup>
        <ConfirmButton onClick={onConfirmDelete} isActive>Да, удалить</ConfirmButton>
        <CancelButton onClick={onClose} variant="secondary">Нет, оставить</CancelButton>
      </ButtonGroup>
    </>
  );
}
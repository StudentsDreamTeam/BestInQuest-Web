// src/components/DeleteTaskConfirmationModal/DeleteTaskConfirmationModal.jsx
import { styled } from 'styled-components';
import Button from '../Button/Button'; // Предполагаем, что Button.jsx подходит

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; // Поверх всего
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem; // Больше паддинг
  border-radius: 25px; // Больше скругление
  text-align: center;
  width: 400px; // Фиксированная ширина
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem; // Крупнее шрифт
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem; // Больше отступ снизу
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between; // Кнопки по краям
  gap: 1rem; // Расстояние между кнопками
`;

// Стили для кнопок, чтобы соответствовать дизайну
const ConfirmButton = styled(Button)`
  background-color: #E9D8FF; // Светло-фиолетовый
  color: #9747FF; // Фиолетовый текст
  flex: 1; // Занимают равное место
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 10px;
  &:hover {
    background-color: #d3b9ff;
  }
`;

const CancelButton = styled(Button)`
  background-color: #fff; // Белый фон
  color: #9747FF; // Фиолетовый текст
  border: 1px solid #E9D8FF; // Фиолетовая рамка (или #9747FF для более яркой)
  flex: 1;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 10px;
  &:hover {
    background-color: #f5f0ff;
  }
`;


export default function DeleteTaskConfirmationModal({ isOpen, onClose, onConfirmDelete }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}> {/* Закрытие по клику на фон */}
      <ModalContent onClick={(e) => e.stopPropagation()}> {/* Предотвращение закрытия по клику на само окно */}
        <ModalTitle>Точно удалить задачу?</ModalTitle>
        <ButtonGroup>
          <ConfirmButton onClick={onConfirmDelete} isActive>Да, удалить</ConfirmButton>
          <CancelButton onClick={onClose} variant="secondary">Нет, оставить</CancelButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
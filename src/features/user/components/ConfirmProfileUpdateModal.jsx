// === FILE: .\src\features\user\components\ConfirmProfileUpdateModal.jsx ===
import { styled } from 'styled-components';
import Button from '../../../components/Button/Button';

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const ChangesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
  max-height: 150px;
  overflow-y: auto;

  li {
    font-size: 1rem;
    color: #555;
    padding: 0.5rem 0;
    border-bottom: 1px dashed #eee;
    &:last-child {
      border-bottom: none;
    }
    strong {
      color: #333;
    }
  }
`;

const NoChangesMessage = styled.p`
  font-size: 1rem;
  color: #777;
  text-align: center;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around; /* Распределяем кнопки */
  gap: 1rem;
`;

const ConfirmButton = styled(Button)`
  background-color: #9747FF; /* Фирменный фиолетовый */
  color: white;
  flex: 1;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px; /* Немного меньше скругление */
  &:hover {
    background-color: #823cdf;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d; /* Серый для отмены */
  color: white;
  flex: 1;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  margin-right: 0; /* Убираем правый отступ у последней кнопки */
  &:hover {
    background-color: #5a6268;
  }
`;

export default function ConfirmProfileUpdateModal({ onClose, onConfirm, changes }) {
  const changeEntries = Object.entries(changes).filter(([key, value]) => value.new !== value.old && value.new !== '');
  
  return (
    <>
      <ModalTitle>Подтвердить изменения?</ModalTitle>
      {changeEntries.length > 0 ? (
        <ChangesList>
          {changeEntries.map(([key, value]) => (
            <li key={key}>
              <strong>{key === 'name' ? 'Имя' : key === 'email' ? 'Email' : 'Пароль'}:</strong>{' '}
              {key === 'password' ? 'будет изменен' : `с "${value.old}" на "${value.new}"`}
            </li>
          ))}
        </ChangesList>
      ) : (
        <NoChangesMessage>Нет изменений для сохранения.</NoChangesMessage>
      )}
      <ButtonGroup>
        <ConfirmButton onClick={onConfirm} disabled={changeEntries.length === 0}>
          Да, сохранить
        </ConfirmButton>
        <CancelButton onClick={onClose} variant="secondary">
          Отмена
        </CancelButton>
      </ButtonGroup>
    </>
  );
}
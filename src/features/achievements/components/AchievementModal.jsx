// === FILE: .\src\features\achievements\components\AchievementModal.jsx ===

import { styled } from 'styled-components';

const ModalContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #fff;
  border-radius: 12px;
  max-height: 90vh;
  overflow-y: auto;
  color: #333;
`;

const AchievementIconLarge = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  background-color: #f0f0f0;
`;

const AchievementNameLarge = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const AchievementDescriptionLarge = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 450px;
`;

const DetailItem = styled.p`
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 0.5rem;
  strong {
    color: #333;
  }
`;

const CloseButton = styled.button`
  background-color: #9747FF;
  color: white;
  padding: 0.7rem 1.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1.5rem; /* Отступ сверху */

  &:hover {
    background-color: #823cdf;
  }
`;


export default function AchievementModal({ achievement, onClose }) {
  if (!achievement) return null;

  const {
    name,
    description,
    iconUrl, // Используем это поле, которое подготавливается в achievementApi.js
    requiredXp,
    type,
  } = achievement; // Убраны isAchieved и связанные с прогрессом поля

  return (
    <ModalContent>
      <AchievementIconLarge src={iconUrl} alt={name} /> {/* iconUrl из achievementApi.js */}
      <AchievementNameLarge>{name}</AchievementNameLarge>
      <AchievementDescriptionLarge>{description}</AchievementDescriptionLarge>

      {typeof requiredXp === 'number' && (
        <DetailItem>
          <strong>Требуемый опыт:</strong> {requiredXp}
        </DetailItem>
      )}
      {type && (
        <DetailItem>
          <strong>Тип:</strong> {type}
        </DetailItem>
      )}
      {/* Нет отображения статуса или прогресса */}
      <CloseButton onClick={onClose}>Закрыть</CloseButton>
    </ModalContent>
  );
}
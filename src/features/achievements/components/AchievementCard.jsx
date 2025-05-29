// === FILE: .\src\features\achievements\components\AchievementCard.jsx ===

import { styled } from 'styled-components';

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  min-height: 280px; /* Примерная высота, чтобы карточки выглядели однородно */
  justify-content: flex-start; /* Контент начинается сверху */
`;

const IconPlaceholder = styled.div`
  width: 150px;
  height: 150px;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
  /* flex-grow: 1; убрано, чтобы не растягивать если текста мало */
`;

export default function AchievementCard({ achievement, onClick }) {
  const { name, description, iconUrl } = achievement; // Убраны isAchieved, progressCurrent, progressTarget

  return (
    <Card onClick={() => onClick(achievement)}>
      <IconPlaceholder>
        <img src={iconUrl} alt={name} /> {/* iconUrl формируется в API сервисе */}
      </IconPlaceholder>
      <Name>{name}</Name>
      <Description>{description}</Description>
      {/* Нет отображения статуса или прогресса */}
    </Card>
  );
}
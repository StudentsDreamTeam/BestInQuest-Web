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
  opacity: ${props => props.$isAchieved ? 1 : 0.6};
  transition: opacity 0.3s, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  min-height: 300px; /* Для примерного выравнивания высоты */
  justify-content: space-between; /* Чтобы контент распределялся */
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
  margin-bottom: 1rem;
  line-height: 1.4;
  flex-grow: 1; /* Позволяет описанию занять доступное место */
`;

const StatusText = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => (props.$isAchieved ? '#28a745' : '#6c757d')};
  margin-top: auto; /* Прижимает текст статуса вниз */
`;


export default function AchievementCard({ achievement, onClick }) {
  // Предполагаем, что API вернет поле isAchieved
  // Поля progressCurrent и progressTarget убираем, так как их нет в новой структуре
  // и прогресс-бара не будет.
  const { name, description, iconUrl, isAchieved, requiredXp, type } = achievement;

  return (
    <Card $isAchieved={!!isAchieved} onClick={() => onClick(achievement)}>
      <IconPlaceholder>
        {/* Используем iconUrl, который мы формируем в achievementApi.js */}
        <img src={iconUrl || '/default_achievement_icon.png'} alt={name} />
      </IconPlaceholder>
      <div> {/* Дополнительная обертка для текста, чтобы StatusText прижимался вниз */}
        <Name>{name}</Name>
        <Description>{description}</Description>
      </div>
       {/* Можно добавить отображение requiredXp или type, если нужно */}
      {/* {requiredXp && <p>Требуется XP: {requiredXp}</p>} */}
      {/* {type && <p>Тип: {type}</p>} */}
      <StatusText $isAchieved={!!isAchieved}>
        {isAchieved ? 'Получено!' : 'Не получено'}
      </StatusText>
    </Card>
  );
}
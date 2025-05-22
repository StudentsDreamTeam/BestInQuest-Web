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
  opacity: ${props => props.$isAchieved ? 1 : 0.6}; /* Менее яркие для не полученных */
  transition: opacity 0.3s;
`;

const IconPlaceholder = styled.div`
  width: 150px; /* Размер как на скриншоте, можно адаптировать */
  height: 150px;
  background-color: #f0f0f0; /* Заглушка, если иконки нет */
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Чтобы изображение не вылезало */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* или contain, в зависимости от иконок */
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
  min-height: 40px; /* Чтобы карточки были примерно одной высоты по тексту */
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: #9747FF; /* Фирменный фиолетовый */
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
`;

const ProgressText = styled.p`
  font-size: 0.75rem;
  color: #6c757d;
  align-self: flex-end; /* Справа под прогресс-баром */
`;

export default function AchievementCard({ achievement }) {
  const { name, description, iconUrl, progressCurrent, progressTarget, isAchieved } = achievement;
  const progressPercentage = progressTarget > 0 ? (Math.min(progressCurrent, progressTarget) / progressTarget) * 100 : (isAchieved ? 100 : 0);

  return (
    <Card $isAchieved={isAchieved}>
      <IconPlaceholder>
        {iconUrl && iconUrl !== "placeholder_icon_url_default.png" ? ( // Проверяем, чтобы не была заглушка по умолчанию, если она есть
          <img src={iconUrl} alt={name} />
        ) : (
          // Можете вставить здесь SVG-заглушку или оставить пустым для фона
          // Либо использовать дефолтную картинку, если она у вас есть в проекте
          <img src="/default_achievement_icon.png" alt="Достижение" /> // Путь к вашей дефолтной картинке в public
        )}
      </IconPlaceholder>
      <Name>{name}</Name>
      <Description>{description}</Description>
      {!isAchieved && progressTarget > 0 && ( // Показываем прогресс только если не получено и есть цель
        <>
          <ProgressBarContainer>
            <ProgressBarFill $progress={progressPercentage} />
          </ProgressBarContainer>
          <ProgressText>{`${progressCurrent} из ${progressTarget}`}</ProgressText>
        </>
      )}
      {isAchieved && (
        <ProgressText>Получено!</ProgressText>
      )}
    </Card>
  );
}
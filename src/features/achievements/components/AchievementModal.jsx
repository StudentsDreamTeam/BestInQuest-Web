// === NEW FILE: .\src\features\achievements\components\AchievementModal.jsx ===

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
  width: 200px; /* Размер побольше, чем в карточке */
  height: 200px;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  background-color: #f0f0f0; /* Заглушка, если изображение с прозрачностью */
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

const StatusText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => (props.$isAchieved ? '#28a745' : '#6c757d')}; /* Зеленый для полученных, серый для остальных */
`;

const ProgressBarContainerLarge = styled.div`
  width: 80%;
  max-width: 300px;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

const ProgressBarFillLarge = styled.div`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: #9747FF; /* Фирменный фиолетовый */
  border-radius: 5px;
  transition: width 0.3s ease-in-out;
`;

const ProgressTextLarge = styled.p`
  font-size: 0.9rem;
  color: #495057;
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
  margin-top: 1rem;

  &:hover {
    background-color: #823cdf;
  }
`;


export default function AchievementModal({ achievement, onClose }) {
  if (!achievement) return null;

  const { name, description, iconUrl, progressCurrent, progressTarget, isAchieved } = achievement;
  const progressPercentage = progressTarget > 0 ? (Math.min(progressCurrent, progressTarget) / progressTarget) * 100 : (isAchieved ? 100 : 0);

  return (
    <ModalContent>
      <AchievementIconLarge src={iconUrl || '/default_achievement_icon.png'} alt={name} />
      <AchievementNameLarge>{name}</AchievementNameLarge>
      <AchievementDescriptionLarge>{description}</AchievementDescriptionLarge>

      {isAchieved ? (
        <StatusText $isAchieved={true}>Достижение получено!</StatusText>
      ) : (
        <>
          <StatusText $isAchieved={false}>В процессе</StatusText>
          {progressTarget > 0 && (
            <>
              <ProgressBarContainerLarge>
                <ProgressBarFillLarge $progress={progressPercentage} />
              </ProgressBarContainerLarge>
              <ProgressTextLarge>{`${progressCurrent} / ${progressTarget}`}</ProgressTextLarge>
            </>
          )}
        </>
      )}
      <CloseButton onClick={onClose}>Закрыть</CloseButton>
    </ModalContent>
  );
}
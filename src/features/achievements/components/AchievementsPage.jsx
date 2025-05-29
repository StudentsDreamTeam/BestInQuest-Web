// === FILE: .\src\features\achievements\components\AchievementsPage.jsx ===

import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import AchievementCard from './AchievementCard';
import AchievementModal from './AchievementModal';
import Modal from '../../../components/Modal/Modal';
import { fetchUserAchievements } from '../services/achievementApi';
import { useUser } from '../../../contexts/UserContext';

const PageContainer = styled.div`
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

// Убираем TabButton, так как вкладок больше не будет
const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
  padding-bottom: 1rem;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 2rem;
`;

const ErrorMessage = styled(LoadingMessage)`
  color: red;
`;

export default function AchievementsPage() {
  const { user, isLoadingUser } = useUser();
  const [achievements, setAchievements] = useState([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const [error, setError] = useState(null);
  // activeTab убираем
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user || !user.id) {
        if (!isLoadingUser) {
            setError("Не удалось загрузить достижения: пользователь не определен.");
            setIsLoadingAchievements(false);
        }
        return;
      }

      setIsLoadingAchievements(true);
      setError(null);
      try {
        const data = await fetchUserAchievements(user.id);
        setAchievements(data);
      } catch (err) {
        console.error("Ошибка при загрузке достижений пользователя:", err);
        setError(err.message);
      } finally {
        setIsLoadingAchievements(false);
      }
    };

    if (!isLoadingUser) {
        loadAchievements();
    }

  }, [user, isLoadingUser]);

  const handleAchievementCardClick = (achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

  // filteredAchievements больше не нужны, всегда показываем все 'achievements'
  if (isLoadingUser) {
    return <PageContainer><LoadingMessage>Загрузка данных пользователя...</LoadingMessage></PageContainer>;
  }
  if (isLoadingAchievements) {
    return <PageContainer><LoadingMessage>Загрузка достижений...</LoadingMessage></PageContainer>;
  }

  if (error) {
    return <PageContainer><ErrorMessage>Ошибка: {error}</ErrorMessage></PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Достижения</PageTitle> {/* Просто заголовок */}
      </PageHeader>
      {achievements.length > 0 ? (
        <AchievementsGrid>
          {achievements.map(ach => ( // Используем 'achievements' напрямую
            <AchievementCard
              key={ach.id}
              achievement={ach}
              onClick={handleAchievementCardClick}
            />
          ))}
        </AchievementsGrid>
      ) : (
        <LoadingMessage>
          Достижения не найдены.
        </LoadingMessage>
      )}

      <Modal open={isModalOpen} onCloseModal={handleCloseModal} modelType="achievementDetail">
        {selectedAchievement && (
          <AchievementModal
            achievement={selectedAchievement}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </PageContainer>
  );
}
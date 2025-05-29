// === FILE: .\src\features\achievements\components\AchievementsPage.jsx ===

import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import AchievementCard from './AchievementCard';
import AchievementModal from './AchievementModal';
import Modal from '../../../components/Modal/Modal';
import { fetchUserAchievements } from '../services/achievementApi'; // Изменено
import { useUser } from '../../../contexts/UserContext'; // Новый импорт

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

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  font-size: 1.1rem;
  font-weight: ${props => (props.$isActive ? '600' : '500')};
  color: ${props => (props.$isActive ? '#9747FF' : '#6c757d')};
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    display: ${props => (props.$isActive ? 'block' : 'none')};
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #9747FF;
  }

  &:hover {
    color: #9747FF;
  }
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
  const { user, isLoadingUser } = useUser(); // Получаем пользователя из контекста
  const [achievements, setAchievements] = useState([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true); // Переименовано для ясности
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user || !user.id) {
        // Пользователь еще не загружен или отсутствует ID, ждем
        if (!isLoadingUser) { // Если загрузка пользователя завершилась и его нет
            setError("Не удалось загрузить достижения: пользователь не определен.");
            setIsLoadingAchievements(false);
        }
        return;
      }

      setIsLoadingAchievements(true);
      setError(null);
      try {
        // console.log(`Запрос достижений для пользователя ID: ${user.id}`);
        const data = await fetchUserAchievements(user.id); // Используем ID пользователя
        // Предполагаем, что API возвращает isAchieved и progressCurrent для каждого достижения.
        setAchievements(data);
      } catch (err) {
        console.error("Ошибка при загрузке достижений пользователя:", err);
        setError(err.message);
      } finally {
        setIsLoadingAchievements(false);
      }
    };

    // Загружаем достижения, когда пользователь (user.id) становится доступен.
    // Если isLoadingUser true, то эффект все равно подождет следующего рендера, когда user может появиться.
    if (!isLoadingUser) {
        loadAchievements();
    }

  }, [user, isLoadingUser]); // Зависимость от user и isLoadingUser

  const handleAchievementCardClick = (achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

  const filteredAchievements = activeTab === 'all'
    ? achievements
    : achievements.filter(ach => ach.isAchieved);

  // Сначала проверяем загрузку пользователя, потом загрузку достижений
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
        <TabButton $isActive={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          Все
        </TabButton>
        <TabButton $isActive={activeTab === 'achieved'} onClick={() => setActiveTab('achieved')}>
          Полученные
        </TabButton>
      </PageHeader>
      {filteredAchievements.length > 0 ? (
        <AchievementsGrid>
          {filteredAchievements.map(ach => (
            <AchievementCard
              key={ach.id}
              achievement={ach}
              onClick={handleAchievementCardClick}
            />
          ))}
        </AchievementsGrid>
      ) : (
        <LoadingMessage>
          {activeTab === 'achieved' ? 'У вас пока нет полученных достижений.' : 'Достижения не найдены.'}
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
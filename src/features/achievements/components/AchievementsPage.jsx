import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import AchievementCard from './AchievementCard';
import { fetchAllAchievements } from '../services/achievementApi';

const PageContainer = styled.div`
  padding: 0; /* Убираем padding, так как Main.css его уже имеет */
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: flex-start; /* Кнопки слева */
  align-items: center;
  padding: 1rem 0; /* Вертикальные отступы для хедера */
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
    bottom: -1px; /* Чтобы линия была точно под текстом, перекрывая border-bottom хедера */
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Адаптивная сетка */
  gap: 1.5rem;
  overflow-y: auto; /* Прокрутка для списка достижений */
  flex-grow: 1; /* Занимает оставшееся место */
  padding-bottom: 1rem; /* Отступ снизу для прокрутки */
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
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' или 'achieved'

  useEffect(() => {
    const loadAchievements = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAllAchievements();
        // В реальном приложении, вы бы, возможно, получали UserAchievements,
        // где поле isAchieved и progressCurrent уже установлены сервером для текущего пользователя.
        // Пока мы используем isAchieved из achievements.json (везде false).
        setAchievements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadAchievements();
  }, []);

  const filteredAchievements = activeTab === 'all'
    ? achievements
    : achievements.filter(ach => ach.isAchieved);

  if (isLoading) {
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
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </AchievementsGrid>
      ) : (
        <LoadingMessage>
          {activeTab === 'achieved' ? 'У вас пока нет полученных достижений.' : 'Достижения не найдены.'}
        </LoadingMessage>
      )}
    </PageContainer>
  );
}
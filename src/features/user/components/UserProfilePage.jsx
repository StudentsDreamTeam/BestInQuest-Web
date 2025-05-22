// === FILE: src/features/user/components/UserProfilePage.jsx ===
import { styled } from 'styled-components';
import UserHeader from './UserHeader';
import AccountSettings from './AccountSettings';
import { useUser } from '../../../contexts/UserContext';

const PageContainer = styled.div`
  background-color: #fff; /* Белый фон для всей страницы профиля */
  height: 100%;          /* Занимаем всю высоту доступного пространства в Main */
  overflow-y: auto;      /* Позволяем прокрутку, если контента много */
  display: flex;         /* Используем flex для центрирования и ограничения контента */
  flex-direction: column;
  align-items: center;   /* Центрируем контент по горизонтали */
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px; /* Ограничиваем максимальную ширину самого контента */
  /* margin: 0 auto; - больше не нужен, так как PageContainer центрирует */
`;


const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 2rem;
`;

export default function UserProfilePage() {
  const { user, isLoadingUser } = useUser();

  if (isLoadingUser) {
    return <PageContainer><LoadingMessage>Загрузка профиля...</LoadingMessage></PageContainer>;
  }

  if (!user) {
    return <PageContainer><LoadingMessage>Не удалось загрузить профиль.</LoadingMessage></PageContainer>;
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <UserHeader />
        <AccountSettings />
      </ContentWrapper>
    </PageContainer>
  );
}
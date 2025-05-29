// === FILE: .\src\App.jsx ===

import AppLayout from './layouts/AppLayout';
import LoginPage from './features/auth/components/LoginPage';
import { UserProvider, useUser } from './contexts/UserContext';
import { TasksProvider } from './contexts/TasksContext';
import { styled } from 'styled-components';

// Простой компонент для отображения загрузки
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  z-index: 2000;
  color: #333;
`;

function AppContent() {
  const { user, isLoadingUser, userError } = useUser();

  if (isLoadingUser) {
    return <LoadingOverlay>Проверка сессии...</LoadingOverlay>;
  }

  // Если была ошибка при попытке восстановить сессию и пользователь не загружен
  if (userError && !user) {
    // Мы не показываем ошибку здесь напрямую, т.к. LoginPage сама будет пытаться сделать вход.
    // Это сообщение полезно для отладки.
    console.warn("Ошибка при автоматическом входе, отображается страница входа:", userError);
  }

  if (!user) {
    return <LoginPage />;
  }

  // Пользователь аутентифицирован, показываем основной layout
  return (
    <TasksProvider>
      <AppLayout />
    </TasksProvider>
  );
}

export default function App() {
  return (
    <UserProvider> {/* UserProvider теперь оборачивает всё приложение */}
      <AppContent />
    </UserProvider>
  );
}
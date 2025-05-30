// === FILE: .\src\App.jsx ===

import { useState } from 'react';
import AppLayout from './layouts/AppLayout';
import LoginPage from './features/auth/components/LoginPage';
import RegistrationPage from './features/auth/components/RegistrationPage'; // Новый импорт
import { UserProvider, useUser } from './contexts/UserContext';
import { TasksProvider } from './contexts/TasksContext';
import { styled } from 'styled-components';

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
  const [currentAuthView, setCurrentAuthView] = useState('login'); // 'login' или 'register'
  const [registrationMessage, setRegistrationMessage] = useState('');


  if (isLoadingUser) {
    return <LoadingOverlay>Проверка сессии...</LoadingOverlay>;
  }

  if (userError && !user) {
    console.warn("Ошибка при автоматическом входе, отображается страница входа/регистрации:", userError);
  }

  if (!user) {
    if (currentAuthView === 'login') {
      return (
        <LoginPage
          onSwitchToRegister={() => {
            setRegistrationMessage(''); // Очищаем сообщение при переходе
            setCurrentAuthView('register');
          }}
          registrationSuccessMessage={registrationMessage}
        />
      );
    }
    if (currentAuthView === 'register') {
      return (
        <RegistrationPage
          onSwitchToLogin={() => setCurrentAuthView('login')}
          onRegistrationSuccess={() => {
            setRegistrationMessage('Регистрация прошла успешно! Теперь вы можете войти.');
            setCurrentAuthView('login');
          }}
        />
      );
    }
  }

  // Пользователь аутентифицирован
  return (
    <TasksProvider>
      <AppLayout />
    </TasksProvider>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
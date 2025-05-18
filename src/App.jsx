import { useState, useEffect } from 'react';
import AppLayout from './layouts/AppLayout';
import LoginPage from './features/auth/components/LoginPage';
import { UserProvider } from './contexts/UserContext';
import { TasksProvider } from './contexts/TasksContext';

export default function App() {
  // Простое состояние для симуляции аутентификации
  // В реальном приложении это будет сложнее (например, проверка токена в localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Симуляция проверки аутентификации при загрузке (например, из localStorage)
  useEffect(() => {
    // const storedAuth = localStorage.getItem('isAuthenticated');
    // if (storedAuth === 'true') {
    //   setIsAuthenticated(true);
    // }
    // Пока что мы всегда начинаем с экрана входа
  }, []);


  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // localStorage.setItem('isAuthenticated', 'true'); // Для сохранения между сессиями
  };

  // const handleLogout = () => { // Понадобится позже
  //   setIsAuthenticated(false);
  //   localStorage.removeItem('isAuthenticated');
  // };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <UserProvider> {/* UserProvider теперь загружает пользователя только после "входа" */}
      <TasksProvider>
        <AppLayout /> {/* AppLayout будет доступен только аутентифицированным пользователям */}
      </TasksProvider>
    </UserProvider>
  );
}
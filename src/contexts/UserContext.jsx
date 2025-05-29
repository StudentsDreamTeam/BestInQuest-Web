// === FILE: .\src\contexts\UserContext.jsx ===

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchUserById, loginUser as apiLoginUser } from '../services/userApi.js';

const UserContext = createContext(null);
const USER_ID_STORAGE_KEY = 'BIQ_USER_ID';

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // Попытка восстановить сессию при загрузке
  useEffect(() => {
    const attemptRestoreSession = async () => {
      setIsLoadingUser(true);
      setUserError(null);
      const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

      if (storedUserId) {
        try {
          console.log(`UserContext: Попытка восстановления сессии для пользователя с ID: ${storedUserId}`);
          const userData = await fetchUserById(storedUserId);
          setUser(userData);
          console.log("UserContext: Сессия восстановлена, данные пользователя:", userData);
        } catch (e) {
          console.error("UserContext: Не удалось восстановить сессию:", e);
          setUserError(e.message);
          setUser(null);
          localStorage.removeItem(USER_ID_STORAGE_KEY); // Очистить невалидный ID
        }
      }
      setIsLoadingUser(false);
    };

    attemptRestoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoadingUser(true);
    setUserError(null);
    try {
      const userData = await apiLoginUser(email, password);
      setUser(userData);
      localStorage.setItem(USER_ID_STORAGE_KEY, userData.id);
      console.log("UserContext: Login successful, user data:", userData);
      setIsLoadingUser(false);
      return userData; // Возвращаем данные пользователя для LoginPage, если нужно
    } catch (e) {
      console.error("UserContext: Login failed:", e);
      setUserError(e.message);
      setUser(null);
      localStorage.removeItem(USER_ID_STORAGE_KEY);
      setIsLoadingUser(false);
      throw e; // Пробрасываем ошибку дальше для обработки в LoginPage
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_ID_STORAGE_KEY);
    setUserError(null); // Очищаем ошибки при выходе
    console.log("UserContext: User logged out");
    // Можно добавить редирект на страницу входа, если это не обрабатывается в App.jsx
  }, []);

  // Функция для перезагрузки, если понадобится
  const reloadUser = useCallback(async () => {
    const currentUserId = user?.id || localStorage.getItem(USER_ID_STORAGE_KEY);
    if (!currentUserId) {
        setUserError("Невозможно перезагрузить пользователя: ID не найден.");
        return;
    }
    setIsLoadingUser(true);
    setUserError(null);
    try {
      const userData = await fetchUserById(currentUserId);
      setUser(userData);
    } catch (e) {
      setUserError(e.message);
      setUser(null); // Если не удалось перезагрузить, возможно, сессия невалидна
      localStorage.removeItem(USER_ID_STORAGE_KEY);
    } finally {
      setIsLoadingUser(false);
    }
  }, [user]);


  const value = {
    user,
    isLoadingUser,
    userError,
    login,
    logout,
    reloadUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
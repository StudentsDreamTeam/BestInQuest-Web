import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchUserById } from '../services/userApi.js'; // Убедитесь, что .js есть или убрано согласованно

const UserContext = createContext(null); // Инициализируем null

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) { // Может быть полезно для отладки, если контекст используется вне провайдера
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true при первой загрузке
  const [error, setError] = useState(null);

  const hardcodedUserId = 1;

  // loadUser будет вызываться только когда UserProvider монтируется (т.е. после isAuthenticted = true)
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`UserContext: Попытка загрузки пользователя с ID: ${hardcodedUserId}`);
        const userData = await fetchUserById(hardcodedUserId);
        setUser(userData);
        console.log("UserContext: User data loaded:", userData);
      } catch (e) {
        console.error("UserContext: Failed to load user:", e);
        setError(e.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData(); // Загружаем пользователя при монтировании провайдера
  }, [hardcodedUserId]); // Зависимость от hardcodedUserId, если он мог бы меняться (здесь нет)


  // Функция для перезагрузки, если понадобится
  const reloadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await fetchUserById(hardcodedUserId);
      setUser(userData);
    } catch (e) {
      setError(e.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [hardcodedUserId]);


  const value = {
    user,
    isLoadingUser: isLoading,
    userError: error,
    reloadUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
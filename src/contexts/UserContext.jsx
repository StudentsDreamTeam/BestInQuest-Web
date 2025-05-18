import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchUserById } from '../services/userApi.js';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const hardcodedUserId = 1; // В реальном приложении ID пользователя обычно берется из сессии/токена (КОСТЫЛЬ)

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await fetchUserById(hardcodedUserId);
      setUser(userData);
      console.log("User data loaded:", userData);
    } catch (e) {
      console.error("Failed to load user:", e);
      setError(e.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [hardcodedUserId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    user,
    isLoadingUser: isLoading,
    userError: error,
    reloadUser: loadUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
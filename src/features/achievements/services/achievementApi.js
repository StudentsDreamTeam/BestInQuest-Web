// В реальном приложении здесь был бы API_BASE_URL
// import { API_BASE_URL } from '../../../constants';

/**
 * Загружает все доступные достижения.
 * @returns {Promise<Array<object>>} Массив достижений.
 * @throws {Error} Если запрос не удался.
 */
export const fetchAllAchievements = async () => {
  // Пока грузим из public/achievements.json
  // В будущем: const response = await fetch(`${API_BASE_URL}/achievements`);
  try {
    const response = await fetch('/achievements.json'); // Путь относительно public папки
    if (!response.ok) {
      throw new Error(`Failed to fetch achievements: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
};

// Можно добавить функцию для получения достижений конкретного пользователя,
// когда API будет это поддерживать.
// export const fetchUserAchievements = async (userId) => { ... }
// === FILE: .\src\features\achievements\services\achievementApi.js ===

import { API_BASE_URL } from '../../../constants';

/**
 * Загружает все доступные достижения для конкретного пользователя.
 * API НЕ возвращает статус получения (isAchieved) или текущий прогресс.
 * @param {number|string} userId - ID пользователя.
 * @returns {Promise<Array<object>>} Массив достижений пользователя.
 * @throws {Error} Если запрос не удался.
 */
export const fetchUserAchievements = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch achievements.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/user/${userId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user achievements: ${response.status} ${errorText}`);
    }
    const achievementsFromApi = await response.json();

    // Адаптируем поле 'icon' в 'iconUrl' и используем дефолтное значение, если 'icon' нет
    return achievementsFromApi.map(ach => ({
        ...ach,
        iconUrl: ach.icon || '/default_achievement_icon.png',
    }));

  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
};
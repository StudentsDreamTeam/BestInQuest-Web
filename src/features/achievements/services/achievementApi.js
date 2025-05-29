// === FILE: .\src\features\achievements\services\achievementApi.js ===

import { API_BASE_URL } from '../../../constants';

const DEFAULT_ACHIEVEMENT_ICON_URL = '/default_achievement_icon.png';

/**
 * Загружает все доступные достижения для конкретного пользователя.
 * API НЕ возвращает статус получения (isAchieved) или текущий прогресс.
 * Структура ответа API: массив объектов вида { achievement: { id, name, ... }, acquireDate: "..." }
 * @param {number|string} userId - ID пользователя.
 * @returns {Promise<Array<object>>} Массив достижений пользователя, адаптированный для фронтенда.
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
    const userAchievementsData = await response.json();

    return userAchievementsData.map((userAch, index) => {
      const achievementDetails = userAch.achievement;
      let uniqueKey;

      if (achievementDetails && achievementDetails.id !== undefined && achievementDetails.id !== null) {
        uniqueKey = achievementDetails.id;
      } else {
        console.warn(`Achievement object at index ${index} (or its nested 'achievement' object) is missing an ID. Using fallback key.`, userAch);
        uniqueKey = `achievement-fallback-${index}-${achievementDetails?.name || 'no-name'}`;
      }

      return {
        ...achievementDetails,
        id: uniqueKey,
        iconUrl: DEFAULT_ACHIEVEMENT_ICON_URL, // <--- ВСЕГДА ДЕФОЛТНАЯ ИКОНКА
        // acquireDate: userAch.acquireDate, // Раскомментируйте, если это поле нужно
        // isAchieved: !!userAch.acquireDate, // Раскомментируйте, если нужен флаг isAchieved на основе acquireDate
      };
    });

  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
};
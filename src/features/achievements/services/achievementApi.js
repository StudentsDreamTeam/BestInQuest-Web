// === FILE: .\src\features\achievements\services\achievementApi.js ===

import { API_BASE_URL } from '../../../constants'; // Убедимся, что API_BASE_URL импортирован

/**
 * Загружает все доступные достижения для конкретного пользователя.
 * Включает информацию о том, получено ли достижение и текущий прогресс.
 * @param {number|string} userId - ID пользователя.
 * @returns {Promise<Array<object>>} Массив достижений пользователя.
 * @throws {Error} Если запрос не удался.
 */
export const fetchUserAchievements = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch achievements.");
  }
  try {
    // const response = await fetch('/achievements.json'); // Старый вариант
    const response = await fetch(`${API_BASE_URL}/achievements/user/${userId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user achievements: ${response.status} ${errorText}`);
    }
    const achievements = await response.json();
    // API уже должен возвращать isAchieved и progressCurrent для каждого достижения пользователя
    // Если нет, то здесь может потребоваться дополнительная логика для их определения,
    // но по заданию предполагаем, что API это делает.
    return achievements;
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
};
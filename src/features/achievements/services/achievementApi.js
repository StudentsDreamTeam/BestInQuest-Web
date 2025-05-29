// === FILE: .\src\features\achievements\services\achievementApi.js ===

import { API_BASE_URL } from '../../../constants';

/**
 * Загружает все доступные достижения для конкретного пользователя.
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

    // Адаптируем данные с API к ожидаемой структуре в компонентах, если необходимо
    // или компоненты будут напрямую использовать поля из API.
    // Пока предполагаем, что компоненты будут адаптированы под структуру API.
    // Например, если API возвращает "icon" вместо "iconUrl", компоненты должны это учесть.
    // Также, если API не возвращает progressCurrent/Target, но мы хотим их как-то симулировать (например, для XP ачивок):
    return achievementsFromApi.map(ach => ({
        ...ach,
        iconUrl: ach.icon || '/default_achievement_icon.png', // Используем 'icon' или дефолт
        // progressCurrent: ach.isAchieved ? (ach.requiredXp || 1) : 0, // Упрощенно, если это XP ачивка
        // progressTarget: ach.requiredXp || 1, // Упрощенно
        // isAchieved: ach.isAchieved === undefined ? false : ach.isAchieved // Если isAchieved нет, считаем false
        // Если API НЕ возвращает isAchieved, то логика усложняется.
        // Пока будем ожидать, что isAchieved приходит с API.
    }));

  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
};
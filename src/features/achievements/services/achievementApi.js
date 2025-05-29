// === FILE: .\src\features\achievements\services\achievementApi.js ===
// ВАРИАНТ БЕЗ ISACHIEVED

import { API_BASE_URL } from '../../../constants';

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
        iconUrl: (achievementDetails && achievementDetails.icon) || '/default_achievement_icon.png',
        // acquireDate: userAch.acquireDate, // Можно оставить, если где-то нужен
        // isAchieved здесь НЕ добавляется
      };
    });

  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
};
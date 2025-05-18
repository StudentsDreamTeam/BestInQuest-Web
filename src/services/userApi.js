import { API_BASE_URL } from '../constants';

/**
 * Загружает данные пользователя по ID.
 * @param {number|string} userId - ID пользователя.
 * @returns {Promise<object>} Данные пользователя.
 * @throws {Error} Если запрос не удался.
 */
export async function fetchUserById(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch user ${userId}: ${response.status} ${errorText}`);
  }
  return response.json();
};
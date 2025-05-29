// === FILE: .\src\services\userApi.js ===

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

/**
 * Аутентифицирует пользователя.
 * @param {string} email - Email пользователя.
 * @param {string} password - Пароль пользователя.
 * @returns {Promise<object>} Данные пользователя в случае успеха.
 * @throws {Error} Если аутентификация не удалась.
 */
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/users/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    let errorMessage = `Authentication failed: ${response.status}`;
    try {
      const errorBody = await response.json(); // API может возвращать JSON с ошибкой
      errorMessage += ` - ${errorBody.message || errorBody.error || JSON.stringify(errorBody)}`;
    } catch (e) {
      // Если тело ответа не JSON или пустое
      const textError = await response.text();
      if (textError) {
        errorMessage += ` - ${textError}`;
      }
    }
    throw new Error(errorMessage);
  }
  return response.json(); // Предполагаем, что API возвращает объект пользователя
}
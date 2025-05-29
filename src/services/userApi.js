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
      const errorBody = await response.json();
      errorMessage += ` - ${errorBody.message || errorBody.error || JSON.stringify(errorBody)}`;
    } catch (e) {
      const textError = await response.text();
      if (textError) {
        errorMessage += ` - ${textError}`;
      }
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * Регистрирует нового пользователя.
 * @param {object} registrationData - Данные для регистрации (name, email, password).
 * @returns {Promise<object>} Ответ от API (может быть созданный пользователь или сообщение об успехе).
 * @throws {Error} Если регистрация не удалась.
 */
export async function registerUser(registrationData) {
  const currentDate = new Date().toISOString();
  const payload = {
    ...registrationData,
    xp: 0,
    level: 1,
    streak: 0,
    registrationDate: currentDate,
    lastInDate: currentDate,
  };

  const response = await fetch(`${API_BASE_URL}/users/wrong-add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `Registration failed: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage += ` - ${errorBody.message || errorBody.error || JSON.stringify(errorBody)}`;
    } catch (e) {
      const textError = await response.text();
      if (textError) {
        errorMessage += ` - ${textError}`;
      }
    }
    throw new Error(errorMessage);
  }
  // API может вернуть 201 Created с пустым телом или с созданным пользователем
  // Если тело пустое, response.json() вызовет ошибку, поэтому проверяем Content-Type или статус
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return { success: true, message: "Registration successful, no content returned." }; // Возвращаем объект успеха, если нет JSON
  }
}
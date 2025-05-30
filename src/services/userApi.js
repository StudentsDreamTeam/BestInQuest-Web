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

  const response = await fetch(`${API_BASE_URL}/users/wrong-add`, { // Убедитесь, что эндпоинт правильный, если API изменилось
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
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return { success: true, message: "Registration successful, no content returned." };
  }
}

/**
 * Обновляет профиль пользователя.
 * @param {number|string} userId - ID пользователя.
 * @param {object} profileData - Данные для обновления (могут содержать name, email, password).
 *                                Поля, которые не нужно обновлять, не должны присутствовать или должны быть null/undefined.
 * @returns {Promise<object>} Обновленные данные пользователя.
 * @throws {Error} Если обновление не удалось.
 */
export async function updateUserProfile(userId, profileData) {
  if (!userId) {
    throw new Error("User ID is required to update profile.");
  }

  // Фильтруем поля, чтобы отправлять только измененные и непустые значения
  const payload = {};
  if (profileData.name && profileData.name.trim() !== '') {
    payload.name = profileData.name.trim();
  }
  if (profileData.email && profileData.email.trim() !== '') {
    payload.email = profileData.email.trim();
  }
  if (profileData.password && profileData.password !== '') { // Пароль может быть любым, не тримим
    payload.password = profileData.password;
  }

  if (Object.keys(payload).length === 0) {
    // Если нет данных для обновления, можно либо вернуть текущего пользователя, либо ошибку/сообщение
    // В данном случае, чтобы избежать ненужного запроса, вернем "успех без изменений"
    // Либо можно было бы не вызывать API вовсе, если нет изменений.
    console.warn("No actual data to update for user profile.");
    return { success: true, message: "No changes to update." }; 
    // Или выбросить ошибку, если API не ожидает пустых запросов или требует хотя бы одно поле.
    // throw new Error("No data provided for profile update.");
  }


  const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `Profile update failed: ${response.status}`;
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
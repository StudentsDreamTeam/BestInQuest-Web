import { API_BASE_URL } from '../../../constants';

/**
 * Загружает задачи пользователя по ID.
 * @param {number|string} userId - ID пользователя.
 * @returns {Promise<Array<object>>} Массив задач.
 * @throws {Error} Если запрос не удался.
 */
export const fetchTasksByUserId = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/user/${userId}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch tasks for user ${userId}: ${response.status} ${errorText}`);
  }
  return response.json();
};

/**
 * Создает новую задачу.
 * @param {object} taskData - Данные задачи для создания.
 * @param {number|string} authorId - ID автора (совпадает с executorId для этого API).
 * @returns {Promise<object>} Созданная задача.
 * @throws {Error} Если запрос не удался.
 */
export const createTask = async (taskData, authorId) => {
  // API ожидает authorId и executorId в query params, даже если они есть в теле
  const response = await fetch(`${API_BASE_URL}/tasks/create?authorId=${authorId}&executorId=${authorId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create task: ${response.status} ${errorText}`);
  }
  return response.json();
};

/**
 * Обновляет существующую задачу.
 * @param {number|string} taskId - ID задачи для обновления.
 * @param {object} taskData - Новые данные задачи.
 * @param {number|string} userId - ID пользователя, выполняющего обновление (для query param).
 * @returns {Promise<object>} Обновленная задача.
 * @throws {Error} Если запрос не удался.
 */
export const updateTask = async (taskId, taskData, userId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}?userID=${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update task ${taskId}: ${response.status} ${errorText}`);
  }
  return response.json();
};

/**
 * Удаляет задачу.
 * @param {number|string} taskId - ID задачи для удаления.
 * @param {number|string} userId - ID пользователя, выполняющего удаление (для query param).
 * @returns {Promise<void>}
 * @throws {Error} Если запрос не удался.
 */
export const deleteTask = async (taskId, userId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}?userID=${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete task ${taskId}: ${response.status} ${errorText}`);
  }
  // DELETE запросы часто не возвращают тело или возвращают 204 No Content
};

/**
 * Обновляет статус задачи.
 * @param {number|string} taskId - ID задачи.
 * @param {object} task - Полный объект задачи с обновленным статусом и updateDate.
 * @param {number|string} userId - ID пользователя (автора или того, кто имеет право менять).
 * @returns {Promise<object>} Обновленная задача.
 * @throws {Error} Если запрос не удался.
 */
export const updateTaskStatus = async (taskId, task, userId) => {
    const payload = {
        ...task,
        updateDate: new Date().toISOString(), // Убедимся, что updateDate свежее
    };
    // Используем тот же эндпоинт, что и для общего обновления
    return updateTask(taskId, payload, userId);
};
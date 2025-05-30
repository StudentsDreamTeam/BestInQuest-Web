// === FILE: .\src\features\shop\services\shopApi.js ===

import { API_BASE_URL } from '../../../constants';
import { fetchItemDetailsById as fetchGenericItemDetailsById } from '../../inventory/services/inventoryApi'; // Re-use existing function

/**
 * Загружает все доступные товары магазина.
 * Формат ответа: [{ id, itemId, cost, availability }]
 * @returns {Promise<Array<object>>} Массив товаров из магазина.
 * @throws {Error} Если запрос не удался.
 */
export const fetchShopListings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shop`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch shop listings: ${response.status} ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching shop listings:", error);
    throw error;
  }
};

/**
 * Загружает детали конкретного предмета по его ID.
 * Эта функция теперь является оберткой для общей функции fetchItemDetailsById.
 * @param {number|string} itemId - ID предмета.
 * @returns {Promise<object>} Объект с деталями предмета.
 * @throws {Error} Если запрос не удался.
 */
export const fetchShopItemDetailsById = async (itemId) => {
    return fetchGenericItemDetailsById(itemId);
};

// Покупка предмета (пока заглушка, но API эндпоинт может быть таким)
/**
 * Покупает предмет из магазина.
 * @param {number|string} userId - ID пользователя.
 * @param {number|string} shopListingId - ID товара в магазине (не itemId).
 * @returns {Promise<object>} Ответ от API.
 * @throws {Error} Если запрос не удался.
 */
export const buyShopItem = async (userId, shopListingId) => {
    console.log(`Attempting to buy shop listing ID: ${shopListingId} for user ID: ${userId}`);
    // Пример POST запроса, если API так работает
    /*
    try {
        const response = await fetch(`${API_BASE_URL}/shop/buy/${userId}/${shopListingId}`, {
            method: 'POST',
            // headers: { 'Content-Type': 'application/json' }, // если нужно тело запроса
            // body: JSON.stringify({ amount: 1 }), // если нужно передать количество
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to buy shop item ${shopListingId}: ${response.status} ${errorText}`);
        }
        return response.json(); // или response.text() если нет JSON ответа
    } catch (error) {
        console.error("Error buying shop item:", error);
        throw error;
    }
    */
    // Заглушка успешной покупки
    return Promise.resolve({ success: true, message: `Item ${shopListingId} purchased (simulated).` });
};
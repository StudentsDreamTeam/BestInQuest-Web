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

/**
 * Покупает предмет из магазина.
 * Это комплексная операция:
 * 1. Создает запись в инвентаре пользователя (POST /inventory).
 * 2. (Предполагается) API должно списать стоимость предмета с баланса пользователя и,
 *    возможно, обновить доступность товара в магазине.
 * @param {number|string} userId - ID пользователя.
 * @param {object} itemToBuy - Полный объект товара, содержащий itemId, cost и т.д.
 * @returns {Promise<object>} Ответ от API (обычно созданная запись инвентаря).
 * @throws {Error} Если запрос не удался.
 */
export const buyShopItem = async (userId, itemToBuy) => {
    if (!userId || !itemToBuy || !itemToBuy.id) { // itemToBuy.id здесь это itemId
        throw new Error("User ID and item details are required for purchase.");
    }

    const inventoryPayload = {
        userId: parseInt(userId, 10),
        itemId: parseInt(itemToBuy.id, 10), // item.id из /items/{itemId} является itemId
        amount: 1, // Покупаем по 1 штуке за раз
        acquireDate: new Date().toISOString(),
    };

    try {
        // Шаг 1: Добавление в инвентарь
        // Важно: Этот эндпоинт /inventory должен также обрабатывать списание валюты
        // и, возможно, уменьшение количества товара в магазине (если availability: "limited")
        const response = await fetch(`${API_BASE_URL}/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventoryPayload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Failed to process purchase (add to inventory): ${response.status}`;
            try {
                const errorBody = JSON.parse(errorText);
                errorMessage += ` - ${errorBody.message || errorBody.error || JSON.stringify(errorBody)}`;
            } catch (e) {
                 errorMessage += ` - ${errorText}`;
            }
            throw new Error(errorMessage);
        }
        
        // Если API возвращает созданную запись инвентаря
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        }
        return { success: true, message: "Item purchased and added to inventory." };

    } catch (error) {
        console.error(`Error purchasing item ${itemToBuy.name} (itemId: ${itemToBuy.id}):`, error);
        throw error;
    }
};
// === FILE: .\src\features\inventory\services\inventoryApi.js ===

import { API_BASE_URL } from '../../../constants';

const DEFAULT_ITEM_ICON_URL = '/default_item_icon.png'; // Убедитесь, что этот файл есть в public/

/**
 * Загружает инвентарь пользователя.
 * @param {number|string} userId - ID пользователя.
 * @returns {Promise<Array<object>>} Массив объектов инвентаря пользователя.
 * @throws {Error} Если запрос не удался.
 */
export const fetchUserInventory = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch inventory.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/user/${userId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user inventory: ${response.status} ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user inventory:", error);
    throw error;
  }
};

/**
 * Загружает детали конкретного предмета по его ID.
 * @param {number|string} itemId - ID предмета.
 * @returns {Promise<object>} Объект с деталями предмета.
 * @throws {Error} Если запрос не удался.
 */
export const fetchItemDetailsById = async (itemId) => {
  if (!itemId) {
    throw new Error("Item ID is required to fetch item details.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch item details for ID ${itemId}: ${response.status} ${errorText}`);
    }
    const itemData = await response.json();
    return {
      ...itemData,
      iconUrl: itemData.iconUrl || DEFAULT_ITEM_ICON_URL, // Используем иконку из API, если есть, иначе дефолтную
    };
  } catch (error) {
    console.error(`Error fetching item details for ID ${itemId}:`, error);
    throw error;
  }
};

/**
 * Продает предмет из инвентаря.
 * Эндпоинт: DELETE /inventory/sell/{userId}/{itemId}
 * @param {number|string} userId - ID пользователя, который продает.
 * @param {number|string} itemId - ID предмета (из таблицы Items), который продается.
 * @param {number|string} inventoryEntryId - ID записи в инвентаре (для обновления UI).
 * @returns {Promise<object>} Ответ от API (обычно данные проданного предмета или подтверждение).
 * @throws {Error} Если запрос не удался.
 */
export const sellInventoryItem = async (userId, itemId, inventoryEntryId) => {
  if (!userId) {
    throw new Error("User ID is required to sell an item.");
  }
  if (!itemId) {
    throw new Error("Item ID is required to sell an item.");
  }

  try {
    // API ожидает, что мы продаем по 1 штуке за раз, количество не передается в DELETE запросе
    const response = await fetch(`${API_BASE_URL}/inventory/sell/${userId}/${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(`Failed to sell item: ${response.status} - ${errorJson.message || errorText}`);
      } catch (e) {
        throw new Error(`Failed to sell item: ${response.status} ${errorText}`);
      }
    }
    
    if (response.status === 204) {
        return { success: true, message: "Item sold successfully.", inventoryEntryId: inventoryEntryId };
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        return { ...data, success: true, inventoryEntryId: inventoryEntryId };
    }
    return { success: true, message: "Item sold successfully, no content returned.", inventoryEntryId: inventoryEntryId };

  } catch (error) {
    console.error(`Error selling item (userId: ${userId}, itemId: ${itemId}):`, error);
    throw error;
  }
};
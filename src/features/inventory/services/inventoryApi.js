// === FILE: .\src\features\inventory\services\inventoryApi.js ===

import { API_BASE_URL } from '../../../constants';

const DEFAULT_ITEM_ICON_URL = '/default_item_icon.png'; // Та же иконка, что и для магазина

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
      iconUrl: DEFAULT_ITEM_ICON_URL, // Добавляем URL иконки по умолчанию
    };
  } catch (error) {
    console.error(`Error fetching item details for ID ${itemId}:`, error);
    throw error;
  }
};
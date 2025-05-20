/**
 * Загружает все доступные товары магазина.
 * @returns {Promise<Array<object>>} Массив товаров.
 * @throws {Error} Если запрос не удался.
 */
export const fetchShopItems = async () => {
  // Пока грузим из public/items.json
  try {
    const response = await fetch('/items.json'); // Путь относительно public папки
    if (!response.ok) {
      throw new Error(`Failed to fetch shop items: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching shop items:", error);
    throw error;
  }
};
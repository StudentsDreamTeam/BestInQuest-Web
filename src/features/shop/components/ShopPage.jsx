// === FILE: .\src\features\shop\components\ShopPage.jsx ===

import { useState, useEffect, useCallback } from 'react';
import { styled } from 'styled-components';
import ShopItemCard from './ShopItemCard';
import ShopItemModal from './ShopItemModal';
import Modal from '../../../components/Modal/Modal';
import { fetchShopListings, fetchShopItemDetailsById, buyShopItem } from '../services/shopApi';
import { useUser } from '../../../contexts/UserContext';
// import { useToasts } from '../../../contexts/ToastContext'; // Если есть система уведомлений

const PageContainer = styled.div`
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: flex-start; 
  align-items: center;
  padding: 1rem 0; 
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
`;

const ShopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  overflow-y: auto; 
  flex-grow: 1; 
  padding-bottom: 1rem; 
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 2rem;
`;

export default function ShopPage() {
  const { user, isLoadingUser, reloadUser } = useUser();
  const [shopItems, setShopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { addToast } = useToasts();

  const loadShopData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const shopListings = await fetchShopListings();
      if (shopListings.length === 0) {
        setShopItems([]);
        setIsLoading(false);
        return;
      }

      const detailedItemsPromises = shopListings.map(listing =>
        fetchShopItemDetailsById(listing.itemId)
          .then(details => ({
            ...details, // name, description, rarity, xpMultiplier, etc. from /items/{itemId}
            shopListingId: listing.id, // id из /shop
            cost: listing.cost, // cost из /shop
            availability: listing.availability, // availability из /shop
          }))
          .catch(itemError => {
            console.error(`Failed to load details for item ID ${listing.itemId} (shop listing ID ${listing.id}):`, itemError);
            return {
              id: listing.itemId, // itemId
              shopListingId: listing.id,
              name: `Товар ID ${listing.itemId} (ошибка загрузки)`,
              description: 'Не удалось загрузить описание.',
              cost: listing.cost,
              availability: listing.availability || 'out_of_stock',
              rarity: 'common',
              iconUrl: '/default_item_icon.png',
              error: true
            };
          })
      );
      
      const fullShopItems = await Promise.all(detailedItemsPromises);
      setShopItems(fullShopItems);

    } catch (err) {
      console.error("Ошибка при загрузке товаров магазина:", err);
      setError(err.message);
      // addToast({ title: "Ошибка", message: `Не удалось загрузить товары: ${err.message}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [/* addToast */]);

  useEffect(() => {
    loadShopData();
  }, [loadShopData]);

  const handleItemCardClick = (item) => {
    if (item.availability === 'out_of_stock') return;
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleBuyItem = async (itemToBuy) => {
    if (!user || !user.id) {
      alert("Пожалуйста, войдите в систему, чтобы совершать покупки.");
      // addToast({ title: "Ошибка", message: "Пользователь не авторизован.", type: "error" });
      return;
    }
    if (itemToBuy.availability === 'out_of_stock') {
        alert("Товар закончился.");
        // addToast({ title: "Информация", message: "Этот товар закончился.", type: "info" });
        return;
    }
    if (user.currency < itemToBuy.cost) { // Предполагаем, что в user есть поле currency
        alert("Недостаточно средств для покупки.");
        // addToast({ title: "Ошибка", message: "Недостаточно средств.", type: "error" });
        return;
    }

    try {
      await buyShopItem(user.id, itemToBuy.shopListingId);
      alert(`Вы успешно купили "${itemToBuy.name}"!`);
      // addToast({ title: "Успех!", message: `Вы успешно купили "${itemToBuy.name}"!`, type: "success" });
      
      // Обновить данные пользователя (баланс) и, возможно, доступность товара
      if (reloadUser) {
        reloadUser();
      }
      loadShopData(); // Перезагружаем товары магазина, т.к. доступность могла измениться

      if (isModalOpen) {
        handleCloseModal();
      }

    } catch (buyError) {
      console.error("Ошибка при покупке товара:", buyError);
      alert(`Ошибка покупки: ${buyError.message || "Не удалось совершить покупку."}`);
      // addToast({ title: "Ошибка покупки", message: buyError.message || "Не удалось совершить покупку.", type: "error" });
    }
  };

  if (isLoadingUser) { // Сначала ждем загрузки пользователя
    return <PageContainer><Message>Загрузка данных пользователя...</Message></PageContainer>;
  }
  if (isLoading) {
    return <PageContainer><Message>Загрузка товаров...</Message></PageContainer>;
  }
  if (error) {
    return <PageContainer><Message>Ошибка загрузки товаров: {error}</Message></PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Магазин</PageTitle>
      </PageHeader>
      {shopItems.length > 0 ? (
        <ShopGrid>
          {shopItems.map(item => (
            <ShopItemCard 
              key={item.shopListingId || `shop-item-${item.id}-${Math.random()}`} 
              item={item} 
              onClick={handleItemCardClick}
              onBuyClick={handleBuyItem} 
            />
          ))}
        </ShopGrid>
      ) : (
        <Message>В магазине пока нет товаров.</Message>
      )}

      <Modal open={isModalOpen} onCloseModal={handleCloseModal} modelType="shopItem">
        {selectedItem && (
          <ShopItemModal 
            item={selectedItem} 
            onBuyClick={handleBuyItem} // Передаем обработчик покупки в модалку
          />
        )}
      </Modal>
    </PageContainer>
  );
}
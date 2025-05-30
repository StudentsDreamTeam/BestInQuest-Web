// === FILE: .\src\features\inventory\components\InventoryPage.jsx ===

import { useState, useEffect, useCallback } from 'react';
import { styled } from 'styled-components';
import InventoryItemCard from './InventoryItemCard';
import { fetchUserInventory, fetchItemDetailsById, sellInventoryItem } from '../services/inventoryApi';
import { useUser } from '../../../contexts/UserContext';
// import { useToasts } from '../../../contexts/ToastContext'; // Если используете ToastContext

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

const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

export default function InventoryPage() {
  const { user, isLoadingUser, reloadUser } = useUser(); // Добавляем reloadUser
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [error, setError] = useState(null);
  // const { addToast } = useToasts();

  const loadInventory = useCallback(async () => {
    if (!user || !user.id) {
      if (!isLoadingUser) {
        setError("Не удалось загрузить инвентарь: пользователь не определен.");
        setIsLoadingInventory(false);
      }
      return;
    }

    setIsLoadingInventory(true);
    setError(null);
    try {
      const userInventoryData = await fetchUserInventory(user.id);
      
      if (userInventoryData.length === 0) {
        setInventoryItems([]);
        setIsLoadingInventory(false);
        return;
      }

      const itemDetailsPromises = userInventoryData.map(invItem =>
        fetchItemDetailsById(invItem.itemId)
          .then(details => ({
            ...details, // содержит id предмета (itemId), name, description и т.д.
            amount: invItem.amount,
            acquireDate: invItem.acquireDate,
            inventoryEntryId: invItem.id, // id записи в таблице inventory
          }))
          .catch(itemError => {
            console.error(`Failed to load details for item ID ${invItem.itemId}:`, itemError);
            return { 
              id: invItem.itemId, // itemId
              name: `Предмет ID ${invItem.itemId} (ошибка загрузки)`,
              description: 'Не удалось загрузить описание.',
              rarity: 'common',
              amount: invItem.amount,
              acquireDate: invItem.acquireDate,
              inventoryEntryId: invItem.id,
              iconUrl: '/default_item_icon.png',
              error: true 
            };
          })
      );
      
      const fullInventoryItems = await Promise.all(itemDetailsPromises);
      setInventoryItems(fullInventoryItems);

    } catch (err) {
      console.error("Ошибка при загрузке инвентаря:", err);
      setError(err.message);
      // addToast({ title: "Ошибка", message: `Не удалось загрузить инвентарь: ${err.message}`, type: "error" });
    } finally {
      setIsLoadingInventory(false);
    }
  }, [user, isLoadingUser /*, addToast */]);


  useEffect(() => {
    if (!isLoadingUser && user) { // Загружаем инвентарь только если пользователь загружен
      loadInventory();
    }
  }, [isLoadingUser, user, loadInventory]);

  const handleSellItem = async (itemIdToSell, inventoryEntryIdToUpdate) => {
    if (!user || !user.id) {
        alert("Ошибка: Пользователь не авторизован.");
        return;
    }

    try {
      await sellInventoryItem(user.id, itemIdToSell, inventoryEntryIdToUpdate); // Передаем userId и itemId
      // addToast({ title: "Успех", message: "Предмет успешно продан!", type: "success" });
      alert("Предмет успешно продан!");


      // Обновляем состояние инвентаря локально
      setInventoryItems(prevItems => {
        const itemIndex = prevItems.findIndex(item => item.inventoryEntryId === inventoryEntryIdToUpdate);
        if (itemIndex === -1) return prevItems;

        const updatedItem = { ...prevItems[itemIndex] };
        updatedItem.amount -= 1; // API продает по 1 штуке

        if (updatedItem.amount <= 0) {
          return prevItems.filter(item => item.inventoryEntryId !== inventoryEntryIdToUpdate);
        } else {
          const newItems = [...prevItems];
          newItems[itemIndex] = updatedItem;
          return newItems;
        }
      });
      
      // Обновляем данные пользователя (например, баланс), если это необходимо
      if (reloadUser) {
        reloadUser();
      }

    } catch (sellError) {
      console.error("Ошибка при продаже предмета:", sellError);
      alert(`Ошибка продажи: ${sellError.message || "Не удалось продать предмет."}`);
      // addToast({ title: "Ошибка продажи", message: sellError.message || "Не удалось продать предмет.", type: "error" });
    }
  };


  if (isLoadingUser) {
    return <PageContainer><Message>Загрузка данных пользователя...</Message></PageContainer>;
  }
  // Если пользователь не загружен после isLoadingUser = false, то показываем ошибку или просьбу войти
  if (!user && !isLoadingUser) {
    return <PageContainer><Message>Пользователь не найден. Пожалуйста, войдите в систему.</Message></PageContainer>;
  }
  
  if (isLoadingInventory) {
    return <PageContainer><Message>Загрузка инвентаря...</Message></PageContainer>;
  }

  if (error) {
    return <PageContainer><Message>Ошибка: {error}</Message></PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Инвентарь</PageTitle>
      </PageHeader>
      {inventoryItems.length > 0 ? (
        <InventoryGrid>
          {inventoryItems.map(item => (
            <InventoryItemCard
              key={item.inventoryEntryId || `item-${item.id}-${Math.random()}`} 
              item={item}
              onSellItem={handleSellItem}
            />
          ))}
        </InventoryGrid>
      ) : (
        <Message>Ваш инвентарь пуст.</Message>
      )}
    </PageContainer>
  );
}
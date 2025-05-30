// === FILE: .\src\features\inventory\components\InventoryPage.jsx ===

import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import InventoryItemCard from './InventoryItemCard';
import { fetchUserInventory, fetchItemDetailsById } from '../services/inventoryApi';
import { useUser } from '../../../contexts/UserContext';

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Карточки чуть шире */
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
  const { user, isLoadingUser } = useUser();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInventory = async () => {
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

        // Загружаем детали для каждого предмета
        const itemDetailsPromises = userInventoryData.map(invItem =>
          fetchItemDetailsById(invItem.itemId)
            .then(details => ({
              ...details, // name, description, rarity, xpMultiplier, etc.
              amount: invItem.amount,
              acquireDate: invItem.acquireDate,
              inventoryEntryId: invItem.id, // ID записи в таблице inventory
            }))
            .catch(itemError => {
              console.error(`Failed to load details for item ID ${invItem.itemId}:`, itemError);
              // Возвращаем частичные данные или маркер ошибки, чтобы не сломать Promise.all
              return { 
                id: invItem.itemId, // Используем itemId как fallback ID
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
      } finally {
        setIsLoadingInventory(false);
      }
    };

    if (!isLoadingUser) {
      loadInventory();
    }
  }, [user, isLoadingUser]);

  if (isLoadingUser) {
    return <PageContainer><Message>Загрузка данных пользователя...</Message></PageContainer>;
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
              // Ключ должен быть уникальным для элемента списка.
              // item.id здесь - это id из таблицы Item, а не из таблицы Inventory.
              // invItem.id (inventoryEntryId) - id из таблицы Inventory, он должен быть уникальным.
              key={item.inventoryEntryId || `item-${item.id}`} 
              item={item}
            />
          ))}
        </InventoryGrid>
      ) : (
        <Message>Ваш инвентарь пуст.</Message>
      )}
    </PageContainer>
  );
}
import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import ShopItemCard from './ShopItemCard';
import ShopItemModal from './ShopItemModal';
import Modal from '../../../components/Modal/Modal'; // Общий компонент модального окна
import { fetchShopItems } from '../services/shopApi';

const PageContainer = styled.div`
  padding: 0; /* Убираем padding, так как Main.css его уже имеет */
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Адаптивная сетка */
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
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchShopItems();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  const handleItemCardClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleBuyItem = (item) => {
    console.log(`Попытка покупки товара: ${item.name}, ID: ${item.id}, Стоимость: ${item.cost}`);
    // Здесь позже будет логика покупки
    // Можно закрыть модалку после "покупки" если она была открыта
    // if (isModalOpen) {
    //   handleCloseModal();
    // }
  };

  if (isLoading) {
    return <PageContainer><Message>Загрузка товаров...</Message></PageContainer>;
  }

  if (error) {
    return <PageContainer><Message>Ошибка: {error}</Message></PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Магазин</PageTitle>
        {/* Здесь могут быть фильтры или сортировка в будущем */}
      </PageHeader>
      {items.length > 0 ? (
        <ShopGrid>
          {items.map(item => (
            <ShopItemCard 
              key={item.id} 
              item={item} 
              onClick={handleItemCardClick}
              onBuyClick={handleBuyItem} 
            />
          ))}
        </ShopGrid>
      ) : (
        <Message>В магазине пока нет товаров.</Message>
      )}

      <Modal open={isModalOpen} onCloseModal={handleCloseModal} modelType="shopItem"> {/* modelType для кастомных стилей если нужно */}
        {selectedItem && (
          <ShopItemModal 
            item={selectedItem} 
            onBuyClick={handleBuyItem}
          />
        )}
      </Modal>
    </PageContainer>
  );
}
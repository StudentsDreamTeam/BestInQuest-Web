// === FILE: .\src\features\shop\components\ShopItemCard.jsx ===

import { styled } from 'styled-components';
import { ReactComponent as StarIcon } from '../../../assets/icons/StarIcon.svg';
import { ReactComponent as XPIconSvg } from '../../../assets/icons/XPIcon52x28.svg';
import { ReactComponent as TimeIcon } from '../../../assets/icons/TimeIcon19.svg';
import { formatTaskCardDuration } from '../../../utils/dateTimeUtils';

const availabilityColors = {
  available: '#2ecc71', // Зеленый
  limited: '#f39c12',   // Оранжевый
  out_of_stock: '#e74c3c', // Красный
};

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: ${props => props.$isOutOfStock ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$isOutOfStock ? 0.6 : 1};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%;
  min-height: 320px; /* Для консистентности и кнопки */
  justify-content: space-between;


  &:hover {
    transform: ${props => props.$isOutOfStock ? 'none' : 'translateY(-5px)'};
    box-shadow: ${props => props.$isOutOfStock ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 6px 12px rgba(0, 0, 0, 0.1)'};
  }
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvailabilityBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  color: white;
  background-color: ${props => availabilityColors[props.$availability] || '#bdc3c7'};
  text-transform: capitalize;
  margin-bottom: 0.5rem;
  display: inline-block;
`;


const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #555;

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
  .xp-icon svg {
    width: auto;
    height: 16px;
  }
`;

const BuyButton = styled.button`
  background-color: #9747FF;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  /* margin-top: auto; */ /* Убрали, т.к. карточка flex space-between */

  &:hover {
    background-color: ${props => props.disabled ? '#c7a5f2' : '#823cdf'};
  }
  &:disabled {
    background-color: #c7a5f2;
    cursor: not-allowed;
  }
`;

export default function ShopItemCard({ item, onClick, onBuyClick }) {
  const isOutOfStock = item.availability === 'out_of_stock';

  const handleCardClick = () => {
    if (!isOutOfStock && onClick) {
      onClick(item);
    }
  };
  
  const handleBuy = (e) => {
    e.stopPropagation();
    if (!isOutOfStock && onBuyClick) {
      onBuyClick(item);
    }
  };

  return (
    <CardContainer onClick={handleCardClick} $isOutOfStock={isOutOfStock}>
      <div> {/* Верхняя часть карточки */}
        <ItemImage src={item.iconUrl || '/default_item_icon.png'} alt={item.name} />
        <ItemName>{item.name}</ItemName>
        {item.availability && (
          <AvailabilityBadge $availability={item.availability}>
            {item.availability.replace('_', ' ')}
          </AvailabilityBadge>
        )}
        <StatsRow>
          {item.xpMultiplier > 1 && (
            <StatItem title={`Множитель опыта: x${item.xpMultiplier}`} className="xp-icon">
              <XPIconSvg />
              <span>x{item.xpMultiplier}</span>
            </StatItem>
          )}
          {item.currencyMultiplier > 1 && (
            <StatItem title={`Множитель валюты: x${item.currencyMultiplier}`}>
              <StarIcon style={{ color: '#FFC711' }} />
              <span>x{item.currencyMultiplier}</span>
            </StatItem>
          )}
          {item.duration > 0 && (
            <StatItem title={`Длительность: ${formatTaskCardDuration(item.duration)}`}>
              <TimeIcon style={{ color: '#6c757d' }} />
              <span>{formatTaskCardDuration(item.duration)}</span>
            </StatItem>
          )}
        </StatsRow>
      </div>
      
      <div> {/* Нижняя часть карточки (кнопка) */}
        <BuyButton onClick={handleBuy} disabled={isOutOfStock}>
          {isOutOfStock ? 'Нет в наличии' : 
            <>
              Купить за {item.cost} <StarIcon style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginLeft: '4px', color: '#FFD700' }}/>
            </>
          }
        </BuyButton>
      </div>
    </CardContainer>
  );
}
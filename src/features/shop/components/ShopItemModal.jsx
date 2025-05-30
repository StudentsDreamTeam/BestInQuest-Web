// === FILE: .\src\features\shop\components\ShopItemModal.jsx ===

import { styled } from 'styled-components';
import { ReactComponent as StarIcon } from '../../../assets/icons/StarIcon.svg';
import { ReactComponent as XPIconSvg } from '../../../assets/icons/XPIcon52x28.svg';
// import { ReactComponent as TimeIcon } from '../../../assets/icons/TimeIcon19.svg'; // Если нужно будет длительность
// import { formatTaskCardDuration } from '../../../utils/dateTimeUtils'; // Если нужно будет длительность

const rarityColors = {
  common: '#9DB2BF',
  uncommon: '#52b788',
  rare: '#0077b6',
  epic: '#9747FF',
  legendary: '#f77f00'
};

const availabilityColors = {
  available: '#2ecc71',
  limited: '#f39c12',
  out_of_stock: '#e74c3c',
};

const ModalContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #fff;
  border-radius: 12px;
  max-height: 90vh;
  overflow-y: auto;
`;

const TopBadgesContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  align-items: center;
`;

const ItemRarity = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: white;
  background-color: ${props => rarityColors[props.$rarity?.toLowerCase()] || rarityColors.common};
  text-transform: capitalize;
`;

const AvailabilityBadgeModal = styled(ItemRarity)`
  background-color: ${props => availabilityColors[props.$availability] || '#bdc3c7'};
`;

const ModalStatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: #444;

  svg {
    width: 18px;
    height: 18px;
  }
   .xp-icon svg {
    width: auto;
    height: 18px;
  }
`;

const ModalItemImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  margin-bottom: 1rem;
  border-radius: 10px;
  background-color: #f0f0f0;
`;

const ModalItemName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
`;

const ModalItemDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  max-width: 400px;
`;

const ModalBuyButton = styled.button`
  background-color: #9747FF;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.disabled ? '#c7a5f2' : '#823cdf'};
  }
  &:disabled {
    background-color: #c7a5f2;
    cursor: not-allowed;
  }
`;


export default function ShopItemModal({ item, onBuyClick }) {
  if (!item) return null;

  const isOutOfStock = item.availability === 'out_of_stock';

  const handleBuy = (e) => {
    e.stopPropagation();
    if (!isOutOfStock && onBuyClick) {
      onBuyClick(item);
    }
  };

  return (
    <ModalContent>
      <TopBadgesContainer>
        {item.rarity && <ItemRarity $rarity={item.rarity}>{item.rarity}</ItemRarity>}
        {item.availability && (
            <AvailabilityBadgeModal $availability={item.availability}>
                {item.availability.replace('_', ' ')}
            </AvailabilityBadgeModal>
        )}
      </TopBadgesContainer>
      <ModalStatsRow>
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
        {/* {item.duration > 0 && ( // Если нужна длительность в модалке
          <StatItem title={`Длительность: ${formatTaskCardDuration(item.duration)}`}>
            <TimeIcon style={{ color: '#6c757d' }} />
            <span>{formatTaskCardDuration(item.duration)}</span>
          </StatItem>
        )} */}
      </ModalStatsRow>
      <ModalItemImage src={item.iconUrl || '/default_item_icon.png'} alt={item.name} />
      <ModalItemName>{item.name}</ModalItemName>
      <ModalItemDescription>{item.description}</ModalItemDescription>
      <ModalBuyButton onClick={handleBuy} disabled={isOutOfStock}>
        {isOutOfStock ? 'Нет в наличии' :
          <>
            Купить за {item.cost} <StarIcon style={{ width: '16px', height: '16px', verticalAlign: 'text-bottom', marginLeft: '5px', color: '#FFD700' }} />
          </>
        }
      </ModalBuyButton>
    </ModalContent>
  );
}
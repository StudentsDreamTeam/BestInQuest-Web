import { styled } from 'styled-components';
import { ReactComponent as StarIcon } from '../../../assets/icons/StarIcon.svg';
import { ReactComponent as XPIconSvg } from '../../../assets/icons/XPIcon52x28.svg';
// TimeIcon и formatTaskCardDuration не нужны в модалке по ТЗ, но если понадобятся, можно добавить
// import { ReactComponent as TimeIcon } from '../../../assets/icons/TimeIcon19.svg';
// import { formatTaskCardDuration } from '../../../utils/dateTimeUtils';

const rarityColors = {
  common: '#9DB2BF', // Серый
  uncommon: '#52b788', // Зеленый
  rare: '#0077b6', // Синий
  epic: '#9747FF', // Фиолетовый
  legendary: '#f77f00' // Оранжевый
};

const ModalContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #fff;
  border-radius: 12px; /* Добавим скругление для контента внутри модалки */
  max-height: 90vh; /* Ограничение высоты */
  overflow-y: auto; /* Прокрутка если контент не влезает */
`;

const ItemRarity = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: white;
  background-color: ${props => rarityColors[props.$rarity] || rarityColors.common};
  margin-bottom: 0.75rem;
  text-transform: capitalize;
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
   .xp-icon svg { /* XPIconSvg имеет свои размеры, подгоняем */
    width: auto;
    height: 18px;
  }
`;

const ModalItemImage = styled.img`
  width: 180px; /* Больше, чем в карточке */
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
  max-width: 400px; /* Ограничим ширину описания */
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
    background-color: #823cdf;
  }
`;


export default function ShopItemModal({ item, onBuyClick }) {
  if (!item) return null;

  const handleBuy = (e) => {
    e.stopPropagation();
    onBuyClick(item);
  };

  return (
    <ModalContent>
      <ItemRarity $rarity={item.rarity}>{item.rarity}</ItemRarity>
      <ModalStatsRow>
        {item.currencyMultiplier > 1 && (
          <StatItem title={`Множитель валюты: x${item.currencyMultiplier}`}>
            <StarIcon style={{ color: '#FFC711' }} />
            <span>x{item.currencyMultiplier}</span>
          </StatItem>
        )}
        {item.xpMultiplier > 1 && (
          <StatItem title={`Множитель опыта: x${item.xpMultiplier}`} className="xp-icon">
            <XPIconSvg /> {/* Используем импортированный как компонент */}
            <span>x{item.xpMultiplier}</span>
          </StatItem>
        )}
        {/* Длительность не указана для модального окна в ТЗ, если нужна, можно добавить */}
        {/* {item.duration > 0 && (
          <StatItem title={`Длительность: ${formatTaskCardDuration(item.duration)}`}>
            <TimeIcon style={{ color: '#6c757d' }} />
            <span>{formatTaskCardDuration(item.duration)}</span>
          </StatItem>
        )} */}
      </ModalStatsRow>
      <ModalItemImage src={item.iconUrl || '/default_item_icon.png'} alt={item.name} />
      <ModalItemName>{item.name}</ModalItemName>
      <ModalItemDescription>{item.description}</ModalItemDescription>
      <ModalBuyButton onClick={handleBuy}>
        Купить за {item.cost} <StarIcon style={{ width: '16px', height: '16px', verticalAlign: 'text-bottom', marginLeft: '5px', color: '#FFD700' }} />
      </ModalBuyButton>
    </ModalContent>
  );
}
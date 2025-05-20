import { styled } from 'styled-components';
import { ReactComponent as StarIcon } from '../../../assets/icons/StarIcon.svg'; // Currency
import { ReactComponent as XPIconSvg } from '../../../assets/icons/XPIcon52x28.svg'; // XP Icon
import { ReactComponent as TimeIcon } from '../../../assets/icons/TimeIcon19.svg'; // Duration
import { formatTaskCardDuration } from '../../../utils/dateTimeUtils';

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%; /* Убедимся, что карточка занимает доступную ширину в гриде */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  background-color: #f0f0f0; /* Фон для заглушки, если картинка с прозрачностью */
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  min-height: 44px; /* Для выравнивания высоты карточек */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap; /* На случай если не поместится */
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
  .xp-icon svg { /* XPIconSvg имеет свои размеры, подгоняем */
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
  margin-top: auto; /* Прижимает кнопку вниз, если карточки разной высоты */

  &:hover {
    background-color: #823cdf;
  }
`;

export default function ShopItemCard({ item, onClick, onBuyClick }) {
  const handleBuy = (e) => {
    e.stopPropagation(); // Предотвращаем клик по карточке при клике на кнопку
    onBuyClick(item);
  };

  return (
    <CardContainer onClick={() => onClick(item)}>
      <ItemImage src={item.iconUrl || '/default_item_icon.png'} alt={item.name} />
      <ItemName>{item.name}</ItemName>
      <StatsRow>
        {item.currencyMultiplier > 1 && (
          <StatItem title={`Множитель валюты: x${item.currencyMultiplier}`}>
            <StarIcon style={{ color: '#FFC711' }} />
            <span>x{item.currencyMultiplier}</span>
          </StatItem>
        )}
        {item.xpMultiplier > 1 && (
          <StatItem title={`Множитель опыта: x${item.xpMultiplier}`} className="xp-icon">
            <XPIconSvg />
            <span>x{item.xpMultiplier}</span>
          </StatItem>
        )}
        {item.duration > 0 && (
          <StatItem title={`Длительность: ${formatTaskCardDuration(item.duration)}`}>
            <TimeIcon style={{ color: '#6c757d' }} />
            <span>{formatTaskCardDuration(item.duration)}</span>
          </StatItem>
        )}
      </StatsRow>
      <BuyButton onClick={handleBuy}>
        Купить за {item.cost} <StarIcon style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginLeft: '4px', color: '#FFD700' }}/>
      </BuyButton>
    </CardContainer>
  );
}
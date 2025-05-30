// === FILE: .\src\features\inventory\components\InventoryItemCard.jsx ===

import { styled } from 'styled-components';
import { ReactComponent as StarIcon } from '../../../assets/icons/StarIcon.svg'; // Currency Multiplier
import { ReactComponent as XPIconSvg } from '../../../assets/icons/XPIcon52x28.svg'; // XP Multiplier
import { ReactComponent as TimeIcon } from '../../../assets/icons/TimeIcon19.svg'; // Duration
import { formatTaskCardDuration, formatFullDateTime } from '../../../utils/dateTimeUtils';

// Цвета редкости, как в ShopItemModal
const rarityColors = {
  common: '#9DB2BF', // Серый
  uncommon: '#52b788', // Зеленый (добавим, если появится)
  rare: '#0077b6', // Синий
  epic: '#9747FF', // Фиолетовый
  legendary: '#f77f00' // Оранжевый
};

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  text-align: left; /* Выравнивание текста влево для лучшей читаемости */
  min-height: 320px; /* Зададим минимальную высоту для консистентности */
  justify-content: space-between; /* Распределяем контент */
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: flex-start; /* Иконка и основная инфа */
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #f0f0f0;
  flex-shrink: 0;
`;

const ItemInfoMain = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
`;

const ItemRarity = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  color: white;
  background-color: ${props => rarityColors[props.$rarity?.toLowerCase()] || rarityColors.common};
  text-transform: capitalize;
  display: inline-block; /* Чтобы padding работал корректно */
  margin-bottom: 0.5rem;
`;

const ItemDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 1rem;
  flex-grow: 1; /* Занимает доступное пространство */
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
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

const ItemFooter = styled.div`
  margin-top: auto; /* Прижимает футер вниз */
  font-size: 0.8rem;
  color: #777;
  border-top: 1px solid #f0f0f0;
  padding-top: 0.75rem;
`;

const Amount = styled.span`
  font-weight: 600;
  color: #333;
`;

export default function InventoryItemCard({ item }) {
  const {
    name,
    description,
    rarity,
    xpMultiplier,
    currencyMultiplier,
    duration,
    iconUrl,
    amount,
    acquireDate,
  } = item;

  return (
    <CardContainer>
      <div> {/* Обертка для контента, чтобы футер прижимался */}
        <ItemHeader>
          <ItemImage src={iconUrl || '/default_item_icon.png'} alt={name} />
          <ItemInfoMain>
            <ItemName>{name}</ItemName>
            {rarity && <ItemRarity $rarity={rarity}>{rarity}</ItemRarity>}
          </ItemInfoMain>
        </ItemHeader>
        <ItemDescription>{description}</ItemDescription>
        <StatsGrid>
          {xpMultiplier > 1 && (
            <StatItem title={`Множитель опыта: x${xpMultiplier}`} className="xp-icon">
              <XPIconSvg />
              <span>x{xpMultiplier}</span>
            </StatItem>
          )}
          {currencyMultiplier > 1 && (
            <StatItem title={`Множитель валюты: x${currencyMultiplier}`}>
              <StarIcon style={{ color: '#FFC711' }} />
              <span>x{currencyMultiplier}</span>
            </StatItem>
          )}
          {duration > 0 && (
            <StatItem title={`Длительность: ${formatTaskCardDuration(duration)}`}>
              <TimeIcon style={{ color: '#6c757d' }} />
              <span>{formatTaskCardDuration(duration)}</span>
            </StatItem>
          )}
        </StatsGrid>
      </div>
      <ItemFooter>
        <div>Количество: <Amount>{amount}</Amount></div>
        <div>Получено: {formatFullDateTime(acquireDate)}</div>
      </ItemFooter>
    </CardContainer>
  );
}
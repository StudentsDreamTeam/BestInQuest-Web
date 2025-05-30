// === FILE: .\src\features\inventory\components\InventoryItemCard.jsx ===

import { styled } from 'styled-components';
import { ReactComponent as StarIcon } from '../../../assets/icons/StarIcon.svg'; // Currency Multiplier
import { ReactComponent as XPIconSvg } from '../../../assets/icons/XPIcon52x28.svg'; // XP Multiplier
import { ReactComponent as TimeIcon } from '../../../assets/icons/TimeIcon19.svg'; // Duration
import { formatTaskCardDuration, formatFullDateTime } from '../../../utils/dateTimeUtils';
import Button from '../../../components/Button/Button';

const rarityColors = {
  common: '#9DB2BF',
  uncommon: '#52b788',
  rare: '#0077b6',
  epic: '#9747FF',
  legendary: '#f77f00'
};

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  text-align: left; 
  min-height: 350px;
  justify-content: space-between;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
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
  display: inline-block;
  margin-bottom: 0.5rem;
`;

const ItemDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 1rem;
  flex-grow: 1;
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
  font-size: 0.8rem;
  color: #777;
  border-top: 1px solid #f0f0f0;
  padding-top: 0.75rem;
  margin-top: 1rem;
`;

const Amount = styled.span`
  font-weight: 600;
  color: #333;
`;

const ActionsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const SellButton = styled(Button)`
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  margin-right: 0;

  &:hover {
    background-color: #c0392b;
  }
`;

export default function InventoryItemCard({ item, onSellItem }) {
  const {
    id, // Это itemId (из таблицы Items)
    inventoryEntryId, // ID записи в инвентаре
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

  const handleSellClick = () => {
    if (onSellItem) {
      // Передаем itemId и inventoryEntryId (для обновления UI)
      onSellItem(id, inventoryEntryId); 
    }
  };

  return (
    <CardContainer>
      <div>
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

      <div>
        <ItemFooter>
          <div>Количество: <Amount>{amount}</Amount></div>
          <div>Получено: {formatFullDateTime(acquireDate)}</div>
        </ItemFooter>
        {amount > 0 && (
          <ActionsContainer>
            <SellButton onClick={handleSellClick}>
              Продать 1 шт.
            </SellButton>
          </ActionsContainer>
        )}
      </div>
    </CardContainer>
  );
}
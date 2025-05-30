// === FILE: .\src\features\user\components\UserHeader.jsx ===
import { styled } from 'styled-components';
import defaultUserAvatar from '../../../assets/img/userAvatar.png';
import { ReactComponent as EditIcon } from '../../../assets/icons/EditIcon.svg';
import { ReactComponent as SaveIcon } from '../../../assets/icons/SaveIcon.svg'; // Предполагаем, что есть иконка сохранения
import { ReactComponent as CancelIcon } from '../../../assets/icons/CancelIcon.svg'; // Предполагаем, что есть иконка отмены

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 1.5rem;
  object-fit: cover;
  cursor: pointer; // Для будущей загрузки аватара
  &:hover {
    opacity: 0.8;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const UserNameRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  min-height: 36px; /* Для предотвращения прыжков при смене инпута и текста */
`;

const UserNameDisplay = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-right: 0.75rem;
`;

const NameInput = styled.input`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  margin-right: 0.5rem;
  width: auto;
  min-width: 200px; /* Чтобы инпут не был слишком маленьким */
  max-width: 300px;
`;

const EditControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  
  svg {
    width: 18px;
    height: 18px;
    fill: #9747FF;
  }
  &:hover svg {
    fill: #7a3bb8;
  }
  &.save svg {
    fill: #2ecc71; /* Зеленый для сохранения */
     &:hover {
        fill: #27ae60;
     }
  }
  &.cancel svg {
    fill: #e74c3c; /* Красный для отмены */
    &:hover {
        fill: #c0392b;
    }
  }
`;

const UserStats = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.75rem;

  span {
    font-weight: 600;
    color: #333;
  }
`;

const XpBarContainer = styled.div`
  width: 100%;
  max-width: 300px;
  background-color: #e0e0e0;
  border-radius: 10px;
  height: 10px;
  overflow: hidden;
  margin-top: 0.25rem;
`;

const XpBarFill = styled.div`
  width: ${props => props.$percentage}%; 
  height: 100%;
  background-color: #9747FF;
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
`;

const XpText = styled.div`
  font-size: 0.8rem;
  color: #777;
  text-align: right;
  margin-top: 0.25rem;
  width: 100%;
  max-width: 300px;
`;

// Пропсы: user (объект), isEditingName (булево), localName (строка), 
// onNameChange (функция), onToggleEditName (функция), onSaveName (функция)
export default function UserHeader({
  user,
  isEditingName,
  localName,
  onNameChange,
  onToggleEditName,
  onSaveName,
  onCancelEditName
}) {
  if (!user) return null;

  const xpForCurrentLevel = (user.level -1) * 150 + (user.level > 1 ? 350: 0) ; 
  const xpToReachNextLevel = user.level * 150 + 350; 
  
  const currentLevelXp = user.xp - xpForCurrentLevel;
  const totalXpForThisLevel = xpToReachNextLevel - xpForCurrentLevel;
  
  let progressPercentage = 0;
  if (totalXpForThisLevel > 0) {
    progressPercentage = Math.min(100, Math.max(0,(currentLevelXp / totalXpForThisLevel) * 100));
  } else if (currentLevelXp >= 0) { 
      progressPercentage = 100;
  }

  const handleAvatarClick = () => {
    console.log("Изменение аватара (в разработке)");
    // Здесь будет логика открытия модального окна для загрузки нового аватара
  };

  return (
    <HeaderContainer>
      <Avatar 
        src={user.avatar || defaultUserAvatar} 
        alt={`${user.name} avatar`}
        onClick={handleAvatarClick}
        title="Изменить аватар (в разработке)"
      />
      <UserInfo>
        <UserNameRow>
          {isEditingName ? (
            <>
              <NameInput
                type="text"
                value={localName}
                onChange={onNameChange}
                autoFocus
              />
              <EditControls>
                <ControlButton onClick={onSaveName} title="Сохранить имя" className="save">
                  <SaveIcon />
                </ControlButton>
                <ControlButton onClick={onCancelEditName} title="Отменить" className="cancel">
                  <CancelIcon />
                </ControlButton>
              </EditControls>
            </>
          ) : (
            <>
              <UserNameDisplay>{user.name}</UserNameDisplay>
              <ControlButton onClick={onToggleEditName} title="Изменить имя">
                <EditIcon />
              </ControlButton>
            </>
          )}
        </UserNameRow>
        <UserStats>
          Уровень: <span>{user.level}</span>
        </UserStats>
        <UserStats>
          Общий опыт: <span>{user.xp}</span>
        </UserStats>
        <XpBarContainer>
          <XpBarFill $percentage={progressPercentage} /> 
        </XpBarContainer>
        <XpText>{`${Math.max(0,currentLevelXp)} / ${totalXpForThisLevel} XP`}</XpText>
      </UserInfo>
    </HeaderContainer>
  );
}
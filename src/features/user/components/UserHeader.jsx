import { styled } from 'styled-components';
import { useUser } from '../../../contexts/UserContext';
import defaultUserAvatar from '../../../assets/img/userAvatar.png';
import { ReactComponent as EditIcon } from '../../../assets/icons/EditIcon.svg';

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
`;

const UserName = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-right: 0.75rem;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
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

export default function UserHeader() {
  const { user } = useUser();

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

  const handleNameEdit = () => {
    console.log("Инициировано изменение имени пользователя");
  };

  return (
    <HeaderContainer>
      <Avatar src={user.avatar || defaultUserAvatar} alt={`${user.name} avatar`} />
      <UserInfo>
        <UserNameRow>
          <UserName>{user.name}</UserName>
          <EditButton onClick={handleNameEdit} title="Изменить имя">
            <EditIcon />
          </EditButton>
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
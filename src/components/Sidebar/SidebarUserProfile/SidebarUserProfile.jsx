import './SidebarUserProfile.css';
import { styled } from 'styled-components';
import { ReactComponent as StarIcon } from '../../../assets/icons/StarIcon.svg';
import defaultUserAvatar from '../../../assets/img/userAvatar.png';

const UserProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1.875rem;
  border-radius: 1.25rem;
  background: ${({ $isActive }) => $isActive ? '#E4CFFF' : 'white'}; /* Светло-фиолетовый для активного состояния */
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ $isActive }) => $isActive ? '#D8C2FF' : '#F0F0F0'}; /* Затемнение при наведении */
  }
`;

const UserInfo = styled.div`
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    color: #667085;
  }
`;

const UserStats = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
`;

const XpDisplay = styled.span`
  color: #FFC711;
  font-weight: bold;
  margin-left: 0.25rem;
`;

const StarIconPlaceholder = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  color: #FFC711;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

export default function SidebarUserProfile({ user, isActive, onClick }) {
  if (!user) {
    return <UserProfileWrapper $isActive={false} onClick={() => {}}>Загрузка...</UserProfileWrapper>;
  }

  return (
    <UserProfileWrapper $isActive={isActive} onClick={onClick}>
      <div className="avatar">
        <img src={user.avatar || defaultUserAvatar} alt="User Avatar" />
      </div>
      <UserInfo>
        <h3>{user.name}</h3>
        <p>{user.level} уровень</p>
        <UserStats>
          <StarIconPlaceholder>
            <StarIcon />
          </StarIconPlaceholder>
          <XpDisplay>{user.xp || 0}</XpDisplay>
        </UserStats>
      </UserInfo>
    </UserProfileWrapper>
  );
}
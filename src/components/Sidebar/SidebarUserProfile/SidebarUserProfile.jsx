import './SidebarUserProfile.css';
import defaultUserAvatar from '../../../img/userAvatar.png';
import { styled } from 'styled-components';
import { ReactComponent as StarIcon } from '../../../icons/StarIcon.svg';


const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1.875rem;
  border-radius: 1.25rem;
  background: white;
`;

const UserInfo = styled.div`
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: ;
    color: #333; // Цвет текста для имени
  }
  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    // color: #667085;
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

  svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: currentColor;
  }
`;


export default function SidebarUserProfile({ user }) {
  return (
    <UserProfileContainer>
      <div className="avatar">
        <img src={user.avatar || defaultUserAvatar} alt="User Avatar" />
      </div>

      <UserInfo>
        <h3>{user.name}</h3>
        <p>{user.level} уровень</p>
        <UserStats>
          <StarIconPlaceholder>
            <StarIcon />
            {/* Ваша иконка звезды здесь, например <StarSVG /> */}
          </StarIconPlaceholder>
          <XpDisplay>{user.xp || 0}</XpDisplay> {/* Отображаем user.xp */}
        </UserStats>
      </UserInfo>
    </UserProfileContainer>
  );
}
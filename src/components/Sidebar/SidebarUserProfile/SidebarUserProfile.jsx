import './SidebarUserProfile.css';
import defaultUserAvatar from '../../../img/userAvatar.png';
import { styled } from 'styled-components'

const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  
  padding: 1rem;
  margin-bottom: 1.875rem;
  border-radius: 1.25rem;

  background: white;
`

export default function SidebarUserProfile({ user }) {
  return (
    <UserProfileContainer>
      <div className="avatar">
        <img src={defaultUserAvatar} alt="User Avatar" />
      </div>

      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.level} уровень</p>
        <span className="points">{user.points}</span>
      </div>
    </UserProfileContainer>
  );
}
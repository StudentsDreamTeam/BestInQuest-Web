import { styled } from 'styled-components';
import SidebarUserProfile from './SidebarUserProfile/SidebarUserProfile';
import SidebarMenu from './SidebarMenu/SidebarMenu';
import { useUser } from '../../contexts/UserContext';

const SidebarContainer = styled.nav`
  width: 25%;
  background: #F7F1FF; /* Базовый цвет сайдбара */
  padding: 1.25rem;
  overflow-y: auto;
`;

export default function Sidebar({ activeMenuItem, onMenuItemChange, onProfileClick, menuItems }) {
  const { user } = useUser();

  return (
    <SidebarContainer>
      <SidebarUserProfile
        user={user}
        isActive={activeMenuItem === 'Профиль'}
        onClick={onProfileClick}
      />
      <SidebarMenu
        active={activeMenuItem}
        onChange={onMenuItemChange}
        menuItems={menuItems}
      />
    </SidebarContainer>
  );
}
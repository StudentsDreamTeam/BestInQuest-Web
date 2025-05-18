import { styled } from 'styled-components';
import SidebarUserProfile from './SidebarUserProfile/SidebarUserProfile';
import SidebarMenu from './SidebarMenu/SidebarMenu';
import { useUser } from '../../contexts/UserContext';

const SidebarContainer = styled.nav`
  width: 25%;
  background: #F7F1FF;
  padding: 1.25rem;
  overflow-y: auto;
`

export default function Sidebar({ active, onChange, menuItems }) {
  const { user } = useUser();

  return (
    <SidebarContainer>
      <SidebarUserProfile user={user} />
      <SidebarMenu
        active={active}
        onChange={onChange}
        menuItems={menuItems}
      />
    </SidebarContainer>
  );
}
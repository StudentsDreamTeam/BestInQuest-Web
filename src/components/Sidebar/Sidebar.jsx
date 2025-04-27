import { styled } from 'styled-components'
 
import SidebarUserProfile from './SidebarUserProfile/SidebarUserProfile';
import SidebarMenu from './SidebarMenu/SidebarMenu';

const SidebarContainer = styled.nav`
  width: 22.8125rem;
  background: #F7F1FF;
  padding: 1.25rem;
  overflow-y: auto;
`

export default function Sidebar({ user, active, onChange }) {
  return (

    <SidebarContainer>
      <SidebarUserProfile user={user}/>
      <SidebarMenu active={active} onChange={onChange}/>
    </SidebarContainer>
  );
};

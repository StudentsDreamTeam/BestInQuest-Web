import './Sidebar.css'

import SidebarUserProfile from '../SidebarUserProfile/SidebarUserProfile';
import SidebarMenu from '../SidebarMenu/SidebarMenu';


export default function Sidebar({ user, active, onChange }) {
  return (
    <nav className="sidebar">
      <SidebarUserProfile user={user}/>
      <SidebarMenu active={active} onChange={onChange}/>
    </nav>
  );
};

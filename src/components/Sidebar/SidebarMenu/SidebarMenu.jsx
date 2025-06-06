import { styled } from 'styled-components';
import SidebarButton from '../SidebarButton/SidebarButton';

const SidebarMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // Added some gap between buttons
`;

export default function SidebarMenu({ active, onChange, menuItems }) {
  return (
    <SidebarMenuContainer>
      {menuItems.map((item, index) => (
        <SidebarButton
          isActive={active === item}
          key={index}
          onClick={() => onChange(item)}
          buttonType={item === 'Добавить задачу' ? 'addTask' : 'menuItem'}
        >
          {item}
        </SidebarButton>
      ))}
    </SidebarMenuContainer>
  );
}
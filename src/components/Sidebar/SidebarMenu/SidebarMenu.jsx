import { styled } from 'styled-components'

import SidebarButton from '../SidebarButton/SidebarButton'

const SidebarMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`


export default function SidebarMenu({ active, onChange }) {
  const menuItems = [ 'Добавить задачу', 'Сегодня', 'Проекты', 'Группы',
                      'Награды', 'Инвентарь', 'Достижения', 'Соревнования', 'Рейтинг' ]

  return (
    <SidebarMenuContainer>
      {menuItems.map((item, index) => (
        <SidebarButton
          isActive={active === item}
          key={index}
          onClick={active => onChange(item)}
        >
          {item}
        </SidebarButton>
      ))}
    </SidebarMenuContainer>
      
  )
}
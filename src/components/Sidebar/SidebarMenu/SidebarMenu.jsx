import { styled } from 'styled-components'

import SidebarButton from '../SidebarButton/SidebarButton'

const SidebarMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`


export default function SidebarMenu({ active, onChange }) {
  const menuItems = [ 'Сегодня', 'Проекты', 'Группы',
                      'Награды', 'Инвентарь', 'Достижения', 'Соревнования', 'Рейтинг' ]
  const addTask = 'Добавить задачу'

  return (
    <SidebarMenuContainer>
      <SidebarButton
        isActive={active === addTask}
        key={addTask}
        onClick={active => onChange(addTask)}
      >
        {addTask}
      </SidebarButton>
      
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
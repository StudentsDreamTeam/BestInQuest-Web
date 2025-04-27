import SidebarButton from '../SidebarButton/SidebarButton'
import './SidebarMenu.css'

export default function SidebarMenu({ active, onChange }) {
  const menuItems = [ 'Добавить задачу', 'Сегодня', 'Календарь', 'Проекты', 'Группы',
                      'Награды', 'Инвентарь', 'Достижения', 'Соревнования', 'Рейтинг' ]

  return (
    <div className='sidebar-menu-container'>
      {
        menuItems.map((item, index) => (
          <SidebarButton
            isActive={active === item}
            key={index}
            onClick={active => onChange(item)}
          >
            {item}
          </SidebarButton>
        ))
      }
    </div>
  )
}
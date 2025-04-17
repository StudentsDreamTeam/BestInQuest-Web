import './SidebarMenu.css'

export default function SidebarMenu() {
  const menuItems = [ 'Главная', 'Задачи', 'Календарь', 'Проекты', 'Настройки', 'Помощь', 'Выйти' ]

  return (
    <>
      {
        menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`menu-item ${index === 0 ? 'active' : ''}`}
          >
            {item}
          </div>
        ))
      }
    </>
  )
}
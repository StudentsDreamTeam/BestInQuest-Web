import Botton from '../Button/Button'
import './SidebarMenu.css'

export default function SidebarMenu({ active, onChange }) {
  // const menuItems = [ 'Главная', 'Задачи', 'Календарь', 'Проекты', 'Настройки', 'Помощь', 'Выйти' ]

  // return (
  //   <>
  //     {
  //       menuItems.map((item, index) => (
  //         <div 
  //           key={index} 
  //           className={`menu-item ${index === 0 ? 'active' : ''}`}
  //         >
  //           {item}
  //         </div>
  //       ))
  //     }
  //   </>
  // )

  return (
    <div className='sidebar-menu-container'>
      <Botton
        isActive={active === "add task"}
        // onClick
      >
        Добавить задачу
      </Botton>
      
      <Botton
        isActive={active === 'today'}
        onClick={active => onChange('today')}
      >
        Сегодня
      </Botton>

      <Botton
        isActive={active === "projects"}
        onClick={active => onChange('projects')}
      >
        Проекты
      </Botton>

      <Botton
        isActive={active === "groups"}
        // onClick
      >
        Группы
      </Botton>

      <Botton
        isActive={active === "rewards"}
        // onClick
      >
        Награды
      </Botton>

      <Botton
        isActive={active === "inventory"}
        // onClick
      >
        Инвентарь
      </Botton>

      <Botton
        isActive={active === "achievements"}
        // onClick
      >
        Достижения
      </Botton>

      <Botton
        isActive={active === "competitions"}
        // onClick
      >
        Соревнования
      </Botton>

      <Botton
        isActive={active === "rating"}
        // onClick
      >
        Рейтинг
      </Botton>
    </div>
  )
}
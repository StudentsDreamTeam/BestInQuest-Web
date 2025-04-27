import './Layout.css'
import avatar from '../../img/VasyaPupkin.png'

import { useState } from 'react'
import Sidebar from "../Sidebar/Sidebar"
import Main from "../Main/Main"


export default function Layout() {
  const [ tab, setTab ] = useState('Сегодня')

  const menuItems = [ 'Добавить задачу', 'Сегодня', 'Календарь', 'Проекты', 'Группы',
                      'Награды', 'Инвентарь', 'Достижения', 'Соревнования', 'Рейтинг' ]

  const user = {
    avatar: avatar,
    name: 'Василий Пупкин',
    level: 1,
    points: 200,
  };

  return (
    <div className="layout">
      <Sidebar
        user={user}
        active={tab}
        onChange={current => setTab(current)}
        menuItems={menuItems}
      />
      <Main active={tab}></Main>
    </div>
  );
}
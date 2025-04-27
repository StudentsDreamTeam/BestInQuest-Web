import './Main.css'

import Header from "../Header/Header"
import TaskList from "../TaskList/TaskList"
import ProjectList from "../ProjectList/ProjectList"


export default function Main({ active }) {
  return (
    <>
      <div className='main'>
        { active === 'Добавить задачу' && (
          <>
            <Header />
            В разработке
          </>
        )}

        { active === 'Сегодня' && (
          <>
            <Header />
            <TaskList />
          </>
        )}

        { active === 'Календарь' && (
          <>
            <Header />
            В разработке
          </>
        )}

        { active === 'Проекты' && (
          <>
            <Header />
            В разработке
            <ProjectList />
          </>
        )}

        { active === 'Группы' && (
          <>
            <Header />
            В разработке
          </>
        )}

        { active === 'Награды' && (
          <>
            <Header />
            В разработке
          </>
        )}

        { active === 'Инвентарь' && (
          <>
            <Header />
            В разработке
          </>
        )}

        { active === 'Достижения' && (
          <>
            <Header />
            В разработке
          </>
        )}

        { active === 'Соревнования' && (
          <>
            <Header />
            В разработке
          </>
        )}

        { active === 'Рейтинг' && (
          <>
            <Header />
            В разработке
          </>
        )}
      </div>
    </>
  )
}
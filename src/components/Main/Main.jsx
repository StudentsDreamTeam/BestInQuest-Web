import './Main.css'

import Header from "./Header/Header.jsx"
import TaskList from "./TaskList/TaskList.jsx"
import ProjectList from "./ProjectList/ProjectList.jsx"


export default function Main({ active }) {
  return (
    <>
      <div className='main'>
        { active === 'Добавить задачу' && (
          <>
            <Header title={'Добавить задачу'}/>
            В разработке
          </>
        )}

        { active === 'Сегодня' && (
          <>
            <Header title={'Сегодня'}/>
            <TaskList />
          </>
        )}

        { active === 'Календарь' && (
          <>
            <Header title={'Календарь'}/>
            В разработке
          </>
        )}

        { active === 'Проекты' && (
          <>
            <Header title={'Проекты'}/>
            В разработке
            <ProjectList />
          </>
        )}

        { active === 'Группы' && (
          <>
            <Header title={'Группы'}/>
            В разработке
          </>
        )}

        { active === 'Награды' && (
          <>
            <Header title={'Награды'}/>
            В разработке
          </>
        )}

        { active === 'Инвентарь' && (
          <>
            <Header title={'Инвентарь'}/>
            В разработке
          </>
        )}

        { active === 'Достижения' && (
          <>
            <Header title={'Достижения'}/>
            В разработке
          </>
        )}

        { active === 'Соревнования' && (
          <>
            <Header title={'Соревнования'}/>
            В разработке
          </>
        )}

        { active === 'Рейтинг' && (
          <>
            <Header title={'Рейтинг'}/>
            В разработке
          </>
        )}
      </div>
    </>
  )
}
import './Main.css'

import Header from "./Header/Header.jsx"
import TaskList from "./TaskList/TaskList.jsx"
// import ProjectList from "./ProjectList/ProjectList.jsx"


export default function Main({ active }) {
  return (
    <>
      <div className='main'>
        { active === 'Сегодня' && (
          <>
            <Header title={'Сегодня'}/>
            <TaskList />
          </>
        )}

        { active === 'Магазин' && (
          <>
            <Header title={'Магазин'}/>
            In development
          </>
        )}

        { active === 'Награды' && (
          <>
            <Header title={'Награды'}/>
            In development
          </>
        )}

        { active === 'Инвентарь' && (
          <>
            <Header title={'Инвентарь'}/>
            In development
          </>
        )}

        { active === 'Достижения' && (
          <>
            <Header title={'Достижения'}/>
            In development
          </>
        )}

        {/* { active === 'Календарь' && (
          <>
            <Header title={'Календарь'}/>
            В разработке
          </>
        )} */}

        {/* { active === 'Проекты' && (
          <>
            <Header title={'Проекты'}/>
            В разработке
            <ProjectList />
          </>
        )} */}

        {/* { active === 'Группы' && (
          <>
            <Header title={'Группы'}/>
            В разработке
          </>
        )} */}

        {/* { active === 'Соревнования' && (
          <>
            <Header title={'Соревнования'}/>
            В разработке
          </>
        )} */}

        {/* { active === 'Рейтинг' && (
          <>
            <Header title={'Рейтинг'}/>
            В разработке
          </>
        )} */}
      </div>
    </>
  )
}
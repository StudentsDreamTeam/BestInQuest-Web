import './Main.css'

import Header from "./Header/Header.jsx"
import TaskList from "./TaskList/TaskList.jsx"
// import ProjectList from "./ProjectList/ProjectList.jsx"


export default function Main({ active, tasks, setTasks, onOpenUpdateTaskModal, fetchTasks }) {
  return (
    <>
      <div className='main'>
        { active === 'Сегодня' && (
          <>
            <Header title={'Сегодня'}/>
            <TaskList
              tasks={tasks} // Передаем задачи из Layout
              setTasks={setTasks} // Передаем функцию обновления задач из Layout
              onOpenUpdateTaskModal={onOpenUpdateTaskModal} // Пробрасываем дальше
              fetchTasks={fetchTasks} // Пробрасываем дальше
            />
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
      </div>
    </>
  )
}
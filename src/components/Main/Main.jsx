import './Main.css'

import Header from "./Header/Header.jsx"
import TaskList from "./TaskList/TaskList.jsx"

export default function Main({ active, tasks, setTasks, onOpenUpdateTaskModal, onOpenDeleteConfirmModal, fetchTasks }) {
  return (
    <>
      <div className='main'>
        { active === 'Сегодня' && (
          <>
            <Header title={'Сегодня'}/>
            <TaskList
              tasks={tasks}
              setTasks={setTasks}
              onOpenUpdateTaskModal={onOpenUpdateTaskModal}
              onOpenDeleteConfirmModal={onOpenDeleteConfirmModal} // Пробрасываем дальше
              fetchTasks={fetchTasks}
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
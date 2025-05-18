import './Main.css';
import Header from "./Header/Header.jsx";
import TaskList from "../../features/tasks/components/TaskList";

export default function Main({ active, onOpenUpdateTaskModal, onOpenDeleteConfirmModal }) {
  return (
    <div className='main'>
      {active === 'Сегодня' && (
        <>
          <Header title={'Сегодня'} />
          <TaskList
            onOpenUpdateTaskModal={onOpenUpdateTaskModal}
            onOpenDeleteConfirmModal={onOpenDeleteConfirmModal}
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
  );
}
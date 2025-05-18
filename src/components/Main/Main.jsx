import './Main.css';
import Header from "./Header/Header.jsx";
import TaskList from "../../features/tasks/components/TaskList";
import UserProfilePage from '../../features/user/components/UserProfilePage'; // Импортируем страницу профиля

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
      {active === 'Профиль' && ( // Новое условие для отображения профиля
        <UserProfilePage />
      )}
      {active === 'Магазин' && (
        <>
          <Header title={'Магазин'}/>
          In development
        </>
      )}
      {active === 'Награды' && (
        <>
          <Header title={'Награды'}/>
          In development
        </>
      )}
      {active === 'Инвентарь' && (
        <>
          <Header title={'Инвентарь'}/>
          In development
        </>
      )}
      {active === 'Достижения' && (
        <>
          <Header title={'Достижения'}/>
          In development
        </>
      )}
    </div>
  );
}
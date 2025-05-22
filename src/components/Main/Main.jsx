import './Main.css';
import Header from "./Header/Header.jsx";
import TaskList from "../../features/tasks/components/TaskList";
import UserProfilePage from '../../features/user/components/UserProfilePage';
import AchievementsPage from '../../features/achievements/components/AchievementsPage';
import ShopPage from '../../features/shop/components/ShopPage'; // Новый импорт

export default function Main({ active, onOpenUpdateTaskModal, onOpenDeleteConfirmModal }) {
  // active здесь - это activeView из AppLayout
  let pageTitle = active; // По умолчанию заголовок равен активной вкладке
  if (active === 'Профиль' || active === 'Достижения' || active === 'Магазин') { // Добавили 'Магазин'
    pageTitle = ''; // Для этих страниц свой заголовок не нужен или будет внутри страницы
  }

  return (
    <div className='main'>
      {/* Отображаем Header только для определенных страниц, если нужно */}
      {pageTitle && <Header title={pageTitle} />}

      {active === 'Сегодня' && (
        <TaskList
          onOpenUpdateTaskModal={onOpenUpdateTaskModal}
          onOpenDeleteConfirmModal={onOpenDeleteConfirmModal}
        />
      )}
      {active === 'Профиль' && <UserProfilePage />}
      {active === 'Достижения' && <AchievementsPage />}
      {active === 'Магазин' && <ShopPage />} {/* Новая страница */}

      {/* Другие вкладки */}
      {active === 'Проекты' && (
        <>
          {/* <Header title={'Проекты'} /> */}
          In development (Projects)
        </>
      )}
      {/* {active === 'Магазин' && ( // Удаляем старую заглушку
        <>
          In development (Shop)
        </>
      )} */}
      {active === 'Награды' && (
        <>
          {/* <Header title={'Награды'} /> */}
          In development (Rewards)
        </>
      )}
      {active === 'Инвентарь' && (
        <>
          {/* <Header title={'Инвентарь'} /> */}
          In development (Inventory)
        </>
      )}
    </div>
  );
}
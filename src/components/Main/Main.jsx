// === FILE: .\src\components\Main\Main.jsx ===

import './Main.css';
import Header from "./Header/Header.jsx";
import TaskList from "../../features/tasks/components/TaskList";
import UserProfilePage from '../../features/user/components/UserProfilePage';
import AchievementsPage from '../../features/achievements/components/AchievementsPage';
import ShopPage from '../../features/shop/components/ShopPage';
import InventoryPage from '../../features/inventory/components/InventoryPage'; // Новый импорт

export default function Main({ active, onOpenUpdateTaskModal, onOpenDeleteConfirmModal }) {
  // active здесь - это activeView из AppLayout
  let pageTitle = active; // По умолчанию заголовок равен активной вкладке
  if (active === 'Профиль' || active === 'Достижения' || active === 'Магазин' || active === 'Инвентарь') { // Добавили 'Инвентарь'
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
      {active === 'Магазин' && <ShopPage />}
      {active === 'Инвентарь' && <InventoryPage />} {/* Новая страница */}

      {/* Другие вкладки */}
      {active === 'Проекты' && (
        <>
          {/* <Header title={'Проекты'} /> */}
          In development (Projects)
        </>
      )}
      {/* {active === 'Инвентарь' && ( // Удаляем старую заглушку
        <>
          In development (Inventory)
        </>
      )} */}
      {active === 'Награды' && ( // Награды тоже заглушка, если их нет
        <>
          {/* <Header title={'Награды'} /> */}
          In development (Rewards)
        </>
      )}
    </div>
  );
}
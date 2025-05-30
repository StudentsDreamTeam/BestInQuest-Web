// === FILE: .\src\components\Main\Main.jsx ===

import './Main.css';
import Header from "./Header/Header.jsx";
import TaskList from "../../features/tasks/components/TaskList";
import UserProfilePage from '../../features/user/components/UserProfilePage'; // Убедитесь, что импорт есть
import AchievementsPage from '../../features/achievements/components/AchievementsPage';
import ShopPage from '../../features/shop/components/ShopPage';
import InventoryPage from '../../features/inventory/components/InventoryPage';

export default function Main({ 
  active, 
  onOpenUpdateTaskModal, 
  onOpenDeleteConfirmModal,
  onOpenConfirmProfileModal // Принимаем новый проп
}) {
  let pageTitle = active; 
  if (active === 'Профиль' || active === 'Достижения' || active === 'Магазин' || active === 'Инвентарь') {
    pageTitle = ''; 
  }

  return (
    <div className='main'>
      {pageTitle && <Header title={pageTitle} />}

      {active === 'Сегодня' && (
        <TaskList
          onOpenUpdateTaskModal={onOpenUpdateTaskModal}
          onOpenDeleteConfirmModal={onOpenDeleteConfirmModal}
        />
      )}
      {/* Теперь UserProfilePage рендерится здесь и получает проп */}
      {active === 'Профиль' && <UserProfilePage onOpenConfirmModal={onOpenConfirmProfileModal} />} 
      {active === 'Достижения' && <AchievementsPage />}
      {active === 'Магазин' && <ShopPage />}
      {active === 'Инвентарь' && <InventoryPage />}

      {active === 'Проекты' && (
        <>
          In development (Projects)
        </>
      )}
      {active === 'Награды' && ( 
        <>
          In development (Rewards)
        </>
      )}
    </div>
  );
}
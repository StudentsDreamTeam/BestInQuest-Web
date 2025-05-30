// === FILE: src/layouts/AppLayout.jsx ===
import { useState } from 'react';
import { styled } from 'styled-components';

import Sidebar from "../components/Sidebar/Sidebar";
import Main from "../components/Main/Main";
import Modal from '../components/Modal/Modal';

import CreateTaskForm from '../features/tasks/components/CreateTaskForm';
import UpdateTaskForm from '../features/tasks/components/UpdateTaskForm';
import DeleteTaskConfirmationModal from '../features/tasks/components/DeleteTaskComfirmationModal';
import ConfirmProfileUpdateModal from '../features/user/components/ConfirmProfileUpdateModal'; // Новый импорт

import { useUser } from '../contexts/UserContext';
import { useTasks } from '../contexts/TasksContext';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  z-index: 2000;
`;

export default function AppLayout() {
  const { user, isLoadingUser, userError } = useUser();
  const { deleteTask: deleteTaskFromContext } = useTasks(); 

  const menuItems = ['Добавить задачу', 'Сегодня', 'Магазин', 'Инвентарь', 'Достижения'];
  const [activeView, setActiveView] = useState('Сегодня');

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  
  // Для модального окна подтверждения обновления профиля
  const [isConfirmProfileModalOpen, setIsConfirmProfileModalOpen] = useState(false);
  const [profileChangesToConfirm, setProfileChangesToConfirm] = useState({});
  const [onConfirmProfileUpdateCallback, setOnConfirmProfileUpdateCallback] = useState(null);


  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  function handleSidebarItemClick(itemName) {
    if (itemName === 'Добавить задачу') {
      setIsCreateTaskModalOpen(true);
    } else {
      setActiveView(itemName);
    }
  }

  const handleCloseCreateTaskModal = () => setIsCreateTaskModalOpen(false);
  const handleOpenUpdateTaskModal = (task) => {
    setTaskToEdit(task);
    setIsUpdateTaskModalOpen(true);
  };
  const handleCloseUpdateTaskModal = () => {
    setIsUpdateTaskModalOpen(false);
    setTaskToEdit(null);
  };
  const handleOpenDeleteConfirmModal = (taskId) => {
    setTaskToDeleteId(taskId);
    setIsDeleteConfirmModalOpen(true);
  };
  const handleCloseDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
    setTaskToDeleteId(null);
  };

  const confirmDeleteTask = async () => {
    if (taskToDeleteId && user) {
      try {
        await deleteTaskFromContext(taskToDeleteId);
        handleCloseDeleteConfirmModal();
        if (taskToEdit && taskToEdit.id === taskToDeleteId) {
            handleCloseUpdateTaskModal();
        }
      } catch (error) {
        console.error("Layout: Failed to delete task via context", error);
        handleCloseDeleteConfirmModal();
      }
    }
  };

  // Функции для модального окна подтверждения профиля
  const handleOpenConfirmProfileModal = (changes, onConfirmCallback) => {
    setProfileChangesToConfirm(changes);
    setOnConfirmProfileUpdateCallback(() => onConfirmCallback); // Сохраняем колбэк
    setIsConfirmProfileModalOpen(true);
  };

  const handleCloseConfirmProfileModal = () => {
    setIsConfirmProfileModalOpen(false);
    setProfileChangesToConfirm({});
    setOnConfirmProfileUpdateCallback(null);
  };

  const handleActualConfirmProfileUpdate = () => {
    if (onConfirmProfileUpdateCallback) {
      onConfirmProfileUpdateCallback(); // Вызываем сохраненный колбэк
    }
    handleCloseConfirmProfileModal();
  };


  if (isLoadingUser) return <LoadingOverlay>Загрузка пользователя...</LoadingOverlay>;
  if (userError && !user) { // Показываем LoginPage если есть ошибка и нет юзера (например, при первой загрузке)
      console.warn("AppLayout: User error and no user, potential redirect to login: ", userError);
      // Это состояние должно обрабатываться в App.jsx, AppLayout не должен рендериться
      return <LoadingOverlay>Ошибка: {userError}. Пожалуйста, попробуйте перезагрузить страницу.</LoadingOverlay>;
  }
  if (!user) return <LoadingOverlay>Пользователь не найден. Перенаправление...</LoadingOverlay>; // Или редирект на логин

  return (
    <LayoutContainer>
      <Sidebar
        activeMenuItem={activeView}
        onMenuItemChange={handleSidebarItemClick}
        onProfileClick={() => setActiveView('Профиль')} // Профиль теперь просто меняет activeView
        menuItems={menuItems}
      />

      {/* Передаем onOpenConfirmProfileModal в UserProfilePage через Main или напрямую, если Main не нужен для этого */}
      {activeView === 'Профиль' ? (
         <UserProfilePage onOpenConfirmModal={handleOpenConfirmProfileModal} />
      ) : (
        <Main
            active={activeView}
            onOpenUpdateTaskModal={handleOpenUpdateTaskModal}
            onOpenDeleteConfirmModal={handleOpenDeleteConfirmModal}
        />
      )}


      <Modal open={isCreateTaskModalOpen} modelType={'create'} onCloseModal={handleCloseCreateTaskModal}>
        <CreateTaskForm onClose={handleCloseCreateTaskModal} />
      </Modal>

      <Modal open={isUpdateTaskModalOpen} modelType={'update'} onCloseModal={handleCloseUpdateTaskModal}>
        {taskToEdit && (
          <UpdateTaskForm
            taskToEdit={taskToEdit}
            onClose={handleCloseUpdateTaskModal}
            onInitiateDelete={handleOpenDeleteConfirmModal}
          />
        )}
      </Modal>

      <Modal open={isDeleteConfirmModalOpen} modelType={'delete'} onCloseModal={handleCloseDeleteConfirmModal}>
        <DeleteTaskConfirmationModal
          onClose={handleCloseDeleteConfirmModal}
          onConfirmDelete={confirmDeleteTask}
        />
      </Modal>

      {/* Модальное окно для подтверждения изменений профиля */}
      <Modal open={isConfirmProfileModalOpen} modelType={'delete'} onCloseModal={handleCloseConfirmProfileModal}> {/* Используем modelType 'delete' для схожих размеров */}
        <ConfirmProfileUpdateModal
          changes={profileChangesToConfirm}
          onClose={handleCloseConfirmProfileModal}
          onConfirm={handleActualConfirmProfileUpdate}
        />
      </Modal>
    </LayoutContainer>
  );
}
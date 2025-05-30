// === FILE: src/layouts/AppLayout.jsx ===
import { useState } from 'react';
import { styled } from 'styled-components';

import Sidebar from "../components/Sidebar/Sidebar";
import Main from "../components/Main/Main"; // Main теперь будет отвечать за рендер UserProfilePage
import Modal from '../components/Modal/Modal';

import CreateTaskForm from '../features/tasks/components/CreateTaskForm';
import UpdateTaskForm from '../features/tasks/components/UpdateTaskForm';
import DeleteTaskConfirmationModal from '../features/tasks/components/DeleteTaskComfirmationModal';
import ConfirmProfileUpdateModal from '../features/user/components/ConfirmProfileUpdateModal';

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
  
  const [isConfirmProfileModalOpen, setIsConfirmProfileModalOpen] = useState(false);
  const [profileChangesToConfirm, setProfileChangesToConfirm] = useState({});
  const [onConfirmProfileUpdateCallback, setOnConfirmProfileUpdateCallback] = useState(null);

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  function handleSidebarItemClick(itemName) {
    if (itemName === 'Добавить задачу') {
      setIsCreateTaskModalOpen(true);
    } else {
      setActiveView(itemName); // 'Профиль' также будет устанавливаться здесь
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

  const handleOpenConfirmProfileModal = (changes, onConfirmCallback) => {
    setProfileChangesToConfirm(changes);
    setOnConfirmProfileUpdateCallback(() => onConfirmCallback); 
    setIsConfirmProfileModalOpen(true);
  };

  const handleCloseConfirmProfileModal = () => {
    setIsConfirmProfileModalOpen(false);
    setProfileChangesToConfirm({});
    setOnConfirmProfileUpdateCallback(null);
  };

  const handleActualConfirmProfileUpdate = () => {
    if (onConfirmProfileUpdateCallback) {
      onConfirmProfileUpdateCallback(); 
    }
    handleCloseConfirmProfileModal();
  };

  if (isLoadingUser) return <LoadingOverlay>Загрузка пользователя...</LoadingOverlay>;
  if (userError && !user) { 
      console.warn("AppLayout: User error and no user, potential redirect to login: ", userError);
      return <LoadingOverlay>Ошибка: {userError}. Пожалуйста, попробуйте перезагрузить страницу.</LoadingOverlay>;
  }
  if (!user) return <LoadingOverlay>Пользователь не найден. Перенаправление...</LoadingOverlay>;

  return (
    <LayoutContainer>
      <Sidebar
        activeMenuItem={activeView}
        onMenuItemChange={handleSidebarItemClick}
        onProfileClick={() => setActiveView('Профиль')} 
        menuItems={menuItems}
      />

      {/* Main теперь всегда рендерится и получает onOpenConfirmProfileModal */}
      <Main
        active={activeView}
        onOpenUpdateTaskModal={handleOpenUpdateTaskModal}
        onOpenDeleteConfirmModal={handleOpenDeleteConfirmModal}
        onOpenConfirmProfileModal={handleOpenConfirmProfileModal} // Передаем проп в Main
      />

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

      <Modal open={isConfirmProfileModalOpen} modelType={'delete'} onCloseModal={handleCloseConfirmProfileModal}>
        <ConfirmProfileUpdateModal
          changes={profileChangesToConfirm}
          onClose={handleCloseConfirmProfileModal}
          onConfirm={handleActualConfirmProfileUpdate}
        />
      </Modal>
    </LayoutContainer>
  );
}
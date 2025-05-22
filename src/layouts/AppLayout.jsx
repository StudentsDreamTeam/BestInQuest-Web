// === FILE: src/layouts/AppLayout.jsx ===
import { useState } from 'react';
import { styled } from 'styled-components';

import Sidebar from "../components/Sidebar/Sidebar";
import Main from "../components/Main/Main";
import Modal from '../components/Modal/Modal';

import CreateTaskForm from '../features/tasks/components/CreateTaskForm';
import UpdateTaskForm from '../features/tasks/components/UpdateTaskForm';
import DeleteTaskConfirmationModal from '../features/tasks/components/DeleteTaskComfirmationModal'; // Исправлен путь, если был .jsx
import UserProfilePage from '../features/user/components/UserProfilePage'; // Новый импорт

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
  const { deleteTask: deleteTaskFromContext } = useTasks(); // isLoadingTasks, tasksError можно использовать при необходимости

  const menuItems = ['Добавить задачу', 'Сегодня', 'Магазин', 'Награды', 'Инвентарь', 'Достижения'];
  // 'Профиль' не будет частью menuItems, а будет управляться отдельно
  const [activeView, setActiveView] = useState('Сегодня'); // Что отображается в Main

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  function handleSidebarItemClick(itemName) {
    if (itemName === 'Добавить задачу') {
      setIsCreateTaskModalOpen(true);
      // activeView не меняется, чтобы фон остался на предыдущей активной вкладке
    } else if (itemName === 'Профиль') {
      setActiveView('Профиль');
    }
    else {
      setActiveView(itemName);
    }
  }

  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    // Если до открытия модалки "Добавить задачу" была активна сама "Добавить задачу" (маловероятно, но для полноты),
    // то после закрытия возвращаемся на "Сегодня"
    if (activeView === 'Добавить задачу') { // Это условие может не понадобиться, если 'Добавить задачу' не устанавливается в activeView
        setActiveView('Сегодня');
    }
  };

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

  if (isLoadingUser) return <LoadingOverlay>Загрузка пользователя...</LoadingOverlay>;
  if (userError) return <LoadingOverlay>Ошибка загрузки пользователя: {userError}</LoadingOverlay>;
  if (!user) return <LoadingOverlay>Пользователь не найден.</LoadingOverlay>;

  return (
    <LayoutContainer>
      <Sidebar
        activeMenuItem={activeView}
        onMenuItemChange={handleSidebarItemClick}
        onProfileClick={() => handleSidebarItemClick('Профиль')}
        menuItems={menuItems}
      />

      <Main
        active={activeView}
        onOpenUpdateTaskModal={handleOpenUpdateTaskModal}
        onOpenDeleteConfirmModal={handleOpenDeleteConfirmModal}
      />

      <Modal
        open={isCreateTaskModalOpen}
        modelType={'create'}
        onCloseModal={handleCloseCreateTaskModal}
      >
        <CreateTaskForm onClose={handleCloseCreateTaskModal} />
      </Modal>

      <Modal
        open={isUpdateTaskModalOpen}
        modelType={'update'}
        onCloseModal={handleCloseUpdateTaskModal}
      >
        {taskToEdit && (
          <UpdateTaskForm
            taskToEdit={taskToEdit}
            onClose={handleCloseUpdateTaskModal}
            onInitiateDelete={handleOpenDeleteConfirmModal}
          />
        )}
      </Modal>

      <Modal
        open={isDeleteConfirmModalOpen}
        modelType={'delete'}
        onCloseModal={handleCloseDeleteConfirmModal}
      >
        <DeleteTaskConfirmationModal
          onClose={handleCloseDeleteConfirmModal}
          onConfirmDelete={confirmDeleteTask}
        />
      </Modal>
    </LayoutContainer>
  );
}
import { useState } from 'react';
import { styled } from 'styled-components';

import Sidebar from "../components/Sidebar/Sidebar";
import Main from "../components/Main/Main";
import Modal from '../components/Modal/Modal';

import CreateTaskForm from '../features/tasks/components/CreateTaskForm';
import UpdateTaskForm from '../features/tasks/components/UpdateTaskForm';
import DeleteTaskConfirmationModal from '../features/tasks/components/DeleteTaskComfirmationModal.jsx';

import { useUser } from '../contexts/UserContext';
import { useTasks } from '../contexts/TasksContext';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const LoadingOverlay = styled.div` // Простой оверлей для загрузки
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
  z-index: 2000; // Выше модалок
`;


export default function AppLayout() {
  const { user, isLoadingUser, userError } = useUser();
  const { deleteTask: deleteTaskFromContext, isLoadingTasks, tasksError: contextTasksError } = useTasks();

  const menuItems = ['Добавить задачу', 'Сегодня', 'Магазин', 'Награды', 'Инвентарь', 'Достижения'];
  const [sidebarTab, setSidebarTab] = useState('Сегодня');
  const [currentMainView, setCurrentMainView] = useState('Сегодня');

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);


  function changeTab(tabName) {
    setSidebarTab(tabName);
    if (tabName !== 'Добавить задачу') {
      setCurrentMainView(tabName);
    } else {
      setIsCreateTaskModalOpen(true);
    }
  }

  const handleOpenCreateTaskModal = () => setIsCreateTaskModalOpen(true);
  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    if (sidebarTab === 'Добавить задачу') {
        setSidebarTab(currentMainView !== 'Добавить задачу' ? currentMainView : 'Сегодня');
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

  if (isLoadingUser)  return <LoadingOverlay>Загрузка пользователя...</LoadingOverlay>;
  if (userError)      return <LoadingOverlay>Ошибка загрузки пользователя: {userError}</LoadingOverlay>;
  if (!user)          return <LoadingOverlay>Пользователь не найден.</LoadingOverlay>;

  return (
    <LayoutContainer>
      <Sidebar
        active={sidebarTab}
        onChange={changeTab}
        menuItems={menuItems}
      />

      <Main
        active={currentMainView}
        onOpenUpdateTaskModal={handleOpenUpdateTaskModal}
        onOpenDeleteConfirmModal={handleOpenDeleteConfirmModal}
      />

      <Modal
        open={isCreateTaskModalOpen}
        modelType={'create'}
        onCloseModal={handleCloseCreateTaskModal}
      >
        <CreateTaskForm
          onClose={handleCloseCreateTaskModal}
        />
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
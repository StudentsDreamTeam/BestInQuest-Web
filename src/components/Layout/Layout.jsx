import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import Sidebar from "../Sidebar/Sidebar";
import Main from "../Main/Main";
import Modal from '../Modal/Modal';
import CreateTaskForm from '../CreateTaskForm/CreateTaskForm';
import UpdateTaskForm from '../UpdateTaskForm/UpdateTaskForm';
import DeleteTaskConfirmationModal from '../DeleteTaskComfirmationModal/DeleteTaskComfirmationModal';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export default function Layout() {
  const menuItems = ['Добавить задачу', 'Сегодня', 'Магазин', 'Награды', 'Инвентарь', 'Достижения'];

  const [menuTab, setMenuTab] = useState('Сегодня');
  const [sidebarTab, setSidebarTab] = useState('Сегодня');

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskToDeleteIdForConfirmation, setTaskToDeleteIdForConfirmation] = useState(null);

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();

  function changeTab(current) {
    if (current !== 'Добавить задачу') {
      setMenuTab(current);
    } else {
      setIsCreateTaskModalOpen(true);
    }
    setSidebarTab(current);
  }

  useEffect(() => {
    async function fetchUser() {
      setIsUserLoading(true);
      setError(null);
      try {
        const response = await fetch('user.json');
        // const response = await fetch(`http://localhost:15614/users/${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        setUser(userData);
      } catch (e) {
        console.error("Failed to fetch user:", e);
        setError(e.message);
      } finally {
        setIsUserLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchTasks() {
    try {
      const response = await fetch('tasks.json');
      // const response = await fetch(`http://localhost:15614/tasks/user/${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (e) {
      console.error("Failed to fetch tasks:", e);
    }
    };
    fetchTasks();
  }, []);

  if (isUserLoading) {
    return "Загрузка пользователя...";
  }
  if (error) {
    return "Ошибка при загрузке пользователя";
  }

  async function confirmDeleteTaskInLayout() {
    if (taskToDeleteIdForConfirmation === null || !user || !user.id) {
      console.error("Нет ID задачи для удаления или ID пользователя.");
      closeDeleteConfirmationModal();
      return;
    }

    const apiUrl = `http://localhost:15614/tasks/${taskToDeleteIdForConfirmation}?userID=${user.id}`;
    let success = false;
    try {
      const response = await fetch(apiUrl, { method: 'DELETE' });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error при удалении: ${response.status} - ${errorText}`);
      }
      console.log(`Задача ${taskToDeleteIdForConfirmation} успешно удалена через API.`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDeleteIdForConfirmation));
      success = true;
    } catch (error) {
      console.error("Не удалось удалить задачу:", error);
    } finally {
      // Сначала закрываем модальное окно подтверждения
      closeDeleteConfirmationModal();
      
      // Затем, если удаление было успешным И модальное окно редактирования
      // было открыто именно для удаляемой задачи, закрываем и его.
      if (success && taskToEdit && taskToEdit.id === taskToDeleteIdForConfirmation) {
        handleCloseUpdateTaskModal();
      }
    }
  };

  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    if (sidebarTab === 'Добавить задачу') {
        setSidebarTab(menuTab !== 'Добавить задачу' ? menuTab : 'Сегодня');
    }
  };

  const handleTaskCreated = (newTaskFromApi) => {
    // console.log("Layout: handleTaskCreated CALLED");
    if (newTaskFromApi) {
        setTasks(prevTasks => [newTaskFromApi, ...prevTasks.filter(t => t.id !== newTaskFromApi.id)]);
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

  const handleTaskUpdatedOrDeleted = (updatedOrDeletedTask) => {
    if (updatedOrDeletedTask._deleted) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== updatedOrDeletedTask.id));
    } else {
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedOrDeletedTask.id ? updatedOrDeletedTask : task));
    }
  };

  const openDeleteConfirmationModal = (taskId) => {
    setTaskToDeleteIdForConfirmation(taskId);
    setIsDeleteConfirmModalOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setTaskToDeleteIdForConfirmation(null);
    setIsDeleteConfirmModalOpen(false);
  };



  return (
    <LayoutContainer>
      <Sidebar
        user={user}
        active={sidebarTab}
        onChange={changeTab}
        menuItems={menuItems}
      />

      <Main
        active={menuTab}
        tasks={tasks}
        setTasks={setTasks}
        onOpenUpdateTaskModal={handleOpenUpdateTaskModal}
        onOpenDeleteConfirmModal={openDeleteConfirmationModal}
      />

      <Modal
        open={isCreateTaskModalOpen}
        modelType={'create'}
        onCloseModal={handleCloseCreateTaskModal}
      >
        <CreateTaskForm
          loggedInUser={user}
          onClose={handleCloseCreateTaskModal}
          onTaskCreated={handleTaskCreated}
        />
      </Modal>

      <Modal
        open={isUpdateTaskModalOpen}
        modelType={'update'}
        onCloseModal={handleCloseUpdateTaskModal}
      >
        {taskToEdit && user && (
          <UpdateTaskForm
            taskToEdit={taskToEdit}
            loggedInUser={user}
            onClose={handleCloseUpdateTaskModal}
            onTaskUpdated={handleTaskUpdatedOrDeleted}
            onInitiateDelete={openDeleteConfirmationModal}
          />
        )}
      </Modal>

      <Modal
        open={isDeleteConfirmModalOpen}
        modelType={'delete'}
        onCloseModal={closeDeleteConfirmationModal}
      >
        <DeleteTaskConfirmationModal
          onClose={closeDeleteConfirmationModal}
          onConfirmDelete={confirmDeleteTaskInLayout}
        />
      </Modal>
    </LayoutContainer>
  );
}
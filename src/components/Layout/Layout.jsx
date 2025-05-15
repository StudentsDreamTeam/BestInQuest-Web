// === FILE: .\src\components\Layout\Layout.jsx ===
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
  // console.log("Layout RENDER START"); // Отладка (можно убрать, если не нужны)
  const menuItems = ['Добавить задачу', 'Сегодня', 'Магазин', 'Награды', 'Инвентарь', 'Достижения'];

  const [menuTab, setMenuTab] = useState('Сегодня');
  const [sidebarTab, setSidebarTab] = useState('Сегодня');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [taskToDeleteIdForConfirmation, setTaskToDeleteIdForConfirmation] = useState(null);

  function changeTab(current) {
    if (current !== 'Добавить задачу') {
      setMenuTab(current);
    } else {
      // console.log("Layout: Opening Create Task Modal via changeTab");
      setIsCreateTaskModalOpen(true);
    }
    setSidebarTab(current);
  }

  useEffect(() => {
    // console.log("Layout: useEffect for fetchUser RUNNING");
    async function fetchUser() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('user.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        setUser(userData);
      } catch (e) {
        console.error("Failed to fetch user:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const fetchTasks = async () => {
    // console.log("Layout: fetchTasks RUNNING");
    try {
      const response = await fetch('tasks.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (e) {
      console.error("Failed to fetch tasks:", e);
    }
  };

  useEffect(() => {
    // console.log("Layout: useEffect for fetchTasks RUNNING");
    fetchTasks();
  }, []);

  // useEffect(() => {
  //   console.log("Layout: isDeleteConfirmModalOpen CHANGED to:", isDeleteConfirmModalOpen);
  // }, [isDeleteConfirmModalOpen]);


  if (isLoading) {
    return "Загрузка пользователя...";
  }
  if (error) {
    return "Ошибка при загрузке пользователя";
  }

  const handleCloseCreateTaskModal = () => {
    // console.log("Layout: handleCloseCreateTaskModal CALLED");
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
    // console.log("Layout: handleOpenUpdateTaskModal CALLED for task:", task?.id);
    setTaskToEdit(task);
    setIsUpdateTaskModalOpen(true);
  };

  const handleCloseUpdateTaskModal = () => {
    // console.log("Layout: handleCloseUpdateTaskModal CALLED");
    setIsUpdateTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleTaskUpdatedOrDeleted = (updatedOrDeletedTask) => {
    // console.log("Layout: handleTaskUpdatedOrDeleted CALLED for task:", updatedOrDeletedTask?.id);
    if (updatedOrDeletedTask._deleted) { // Если пришел сигнал об удалении
        setTasks(prevTasks => prevTasks.filter(task => task.id !== updatedOrDeletedTask.id));
    } else { // Иначе это обновление
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedOrDeletedTask.id ? updatedOrDeletedTask : task));
    }
    // onClose вызывается из finally в UpdateTaskForm, так что модалка формы закроется сама
  };

  const openDeleteConfirmationModal = (taskId) => {
    // console.log("Layout: openDeleteConfirmationModal CALLED for taskId:", taskId);
    setTaskToDeleteIdForConfirmation(taskId);
    setIsDeleteConfirmModalOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    // console.log("Layout: closeDeleteConfirmationModal CALLED");
    setTaskToDeleteIdForConfirmation(null);
    setIsDeleteConfirmModalOpen(false);
  };

  const confirmDeleteTaskInLayout = async () => {
    // console.log("Layout: confirmDeleteTaskInLayout CALLED for taskId:", taskToDeleteIdForConfirmation);
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

  // console.log("Layout RENDER END, isDeleteConfirmModalOpen:", isDeleteConfirmModalOpen);
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
        fetchTasks={fetchTasks}
      />

      <Modal
        open={isCreateTaskModalOpen}
        modelType={'default'}
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
        modelType={'default'}
        onCloseModal={handleCloseUpdateTaskModal}
      >
        {taskToEdit && user && (
          <UpdateTaskForm
            taskToEdit={taskToEdit}
            loggedInUser={user}
            onClose={handleCloseUpdateTaskModal} // onClose вызывается из UpdateTaskForm.handleSubmit.finally
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
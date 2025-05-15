import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import Sidebar from "../Sidebar/Sidebar";
import Main from "../Main/Main";
import Modal from '../Modal/Modal';
import CreateTaskForm from '../CreateTaskForm/CreateTaskForm';
import UpdateTaskForm from '../UpdateTaskForm/UpdateTaskForm';

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
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
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
    fetchTasks();
  }, []);


  if (isLoading) {
    return "Загрузка пользователя...";
  }
  if (error) {
    return "Ошибка при загрузке пользователя";
  }

  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    if (sidebarTab === 'Добавить задачу') { // Возвращаем активный таб на сайдбаре, если был "Добавить задачу"
        // Проверяем, какой таб был активен в Main до открытия модалки,
        // если menuTab не "Добавить задачу", то его и ставим.
        // Если menuTab тоже был "Добавить задачу" (маловероятно, но для полноты),
        // то ставим дефолтный, например, "Сегодня".
        setSidebarTab(menuTab !== 'Добавить задачу' ? menuTab : 'Сегодня');
    }
  };

  const handleTaskCreated = async (newTaskFromApi) => { // Предполагаем, что API возвращает созданную задачу
    // Оптимистичное обновление (если API не возвращает созданную задачу или для локального режима)
    // setTasks(prevTasks => [{...newTaskFromForm, id: Date.now()}, ...prevTasks]);
    // fetchTasks(); // Перезагружаем задачи, чтобы увидеть новую
    // Если API возвращает созданную задачу, то лучше использовать ее:
    if (newTaskFromApi) {
        setTasks(prevTasks => [newTaskFromApi, ...prevTasks.filter(t => t.id !== newTaskFromApi.id)]);
    } else {
        await fetchTasks(); // Если API не вернул задачу, перезагружаем все
    }
    handleCloseCreateTaskModal();
  };


  const handleOpenUpdateTaskModal = (task) => {
    setTaskToEdit(task);
    setIsUpdateTaskModalOpen(true);
  };

  const handleCloseUpdateTaskModal = () => {
    setIsUpdateTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleTaskUpdated = (updatedTask) => {
    if (updatedTask._deleted) { // Обработка удаления
        setTasks(prevTasks => prevTasks.filter(task => task.id !== updatedTask.id));
    } else { // Обработка обновления
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    }
    handleCloseUpdateTaskModal();
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
        fetchTasks={fetchTasks}
      />

      <Modal
        open={isCreateTaskModalOpen}
        modelType={'default'}
        onCloseModal={handleCloseCreateTaskModal} // Передаем обработчик закрытия
      >
        <CreateTaskForm
          loggedInUser={user}
          onClose={handleCloseCreateTaskModal} // Этот onClose вызывается из самой формы (кнопки)
          onTaskCreated={handleTaskCreated}
        />
      </Modal>

      <Modal
        open={isUpdateTaskModalOpen}
        modelType={'default'}
        onCloseModal={handleCloseUpdateTaskModal} // Передаем обработчик закрытия
      >
        {taskToEdit && user && (
          <UpdateTaskForm
            taskToEdit={taskToEdit}
            loggedInUser={user}
            onClose={handleCloseUpdateTaskModal} // Этот onClose вызывается из самой формы (кнопки)
            onTaskUpdated={handleTaskUpdated}
          />
        )}
      </Modal>
    </LayoutContainer>
  );
}
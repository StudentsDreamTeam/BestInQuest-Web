
import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import Sidebar from "../Sidebar/Sidebar";
import Main from "../Main/Main";
import Modal from '../Modal/Modal';
import CreateTaskForm from '../CreateTaskForm/CreateTaskForm';

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
        const user = await response.json();
        setUser(user);
      } catch (e) {
        console.error("Failed to fetch user:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);


  if (isLoading) {
    return "Загрузка пользователя...";
  }
  if (error) {
    return "Ошибка при загрузке пользователя";
  }

  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    if (sidebarTab === 'Добавить задачу') {
      setSidebarTab(menuTab);
    }
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
      />

      <Modal
        open={isCreateTaskModalOpen}
        modelType={'default'}
        // onClose prop для Modal, если он должен закрываться по клику на фон или Escape
      >
        <CreateTaskForm
          loggedInUser={user} // Передаем пользователя
          onClose={handleCloseCreateTaskModal} // Используем новый обработчик
          // onTaskCreated={handleTaskCreated} // Понадобится для обновления списка задач
        />
      </Modal>
    </LayoutContainer>
  );
}
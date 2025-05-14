// src/components/Main/TaskList/TaskList.jsx
import Task from '../Task/Task.jsx';
import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import DeleteTaskConfirmationModal from '../../DeleteTaskComfirmationModal/DeleteTaskComfirmationModal.jsx'; // Импорт

const TaskListComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  overflow-y: auto; 
  padding-bottom: 1rem; 
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 2rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: red;
  margin-top: 2rem;
`;
export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('tasks.json'); // Убедитесь, что путь правильный (public/tasks.json)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (e) {
        console.error("Failed to fetch tasks:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const openDeleteModal = (taskId) => {
    setTaskToDeleteId(taskId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteTask = () => {
    if (taskToDeleteId !== null) {
      console.log("Deleting task:", taskToDeleteId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDeleteId));
      // TODO: вызывать API для удаление task на бэкэнде
      closeDeleteModal();
    }
  };

  const handleToggleStatus = (taskId, currentStatus) => {
    const newStatus = currentStatus?.toUpperCase() === 'DONE' ? 'NEW' : 'DONE';
    console.log("Toggling status for task:", taskId, "from", currentStatus, "to", newStatus);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus.toLowerCase() } : task
      )
    );
    // TODO: вызывать API для обновления task на бэкэнде
  };

  if (isLoading) {
    return <LoadingMessage>Загрузка задач...</LoadingMessage>;
  }
  if (error) {
    return <ErrorMessage>Ошибка при загрузке задач: {error}</ErrorMessage>;
  }
  if (tasks.length === 0) {
    return <LoadingMessage>Задач пока нет.</LoadingMessage>;
  }

  return (
    <>
      <TaskListComponent>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDeleteTask={openDeleteModal} // Передаем функцию открытия модалки
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </TaskListComponent>
      <DeleteTaskConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirmDelete={confirmDeleteTask}
      />
    </>
  );
}
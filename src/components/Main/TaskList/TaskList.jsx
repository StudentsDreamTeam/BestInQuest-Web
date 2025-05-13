import Task from '../Task/Task.jsx';
import { styled } from 'styled-components';
import { useEffect, useState } from 'react';

const TaskListComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  overflow-y: auto; // For scrollability if list is long
  padding-bottom: 1rem; // Some padding at the bottom
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
  const [tasks, setTasks] = useState([]); // Renamed data to tasks for clarity
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/task.json'); // Path relative to public folder
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
  }, []); // Empty dependency array means this runs once on mount

  // Placeholder handlers - these would typically involve API calls
  const handleDeleteTask = (taskId) => {
    console.log("Deleting task:", taskId);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    // In a real app: await api.deleteTask(taskId);
  };

  const handleToggleStatus = (taskId, newStatus) => {
    console.log("Toggling status for task:", taskId, "to", newStatus);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    // In a real app: await api.updateTask(taskId, { status: newStatus });
  };


  if (isLoading) {
    return <LoadingMessage>Загрузка задач...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Ошибка при загрузке задач: {error}</ErrorMessage>;
  }

  if (tasks.length === 0) {
    return <LoadingMessage>Задач пока нет.</LoadingMessage>
  }

  return (
    <TaskListComponent>
      {tasks.map((task) => (
        <Task 
          key={task.id} // Use unique ID for key
          task={task}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      ))}
    </TaskListComponent>
  );
}
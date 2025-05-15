import Task from '../Task/Task.jsx';
import { styled } from 'styled-components';
// useEffect, useState убраны, так как tasks теперь приходят из props
import DeleteTaskConfirmationModal from '../../DeleteTaskComfirmationModal/DeleteTaskComfirmationModal.jsx';
import { useState } from 'react'; // useState нужен для модалки удаления

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

// ErrorMessage не используется, так как обработка ошибок загрузки теперь в Layout
// const ErrorMessage = styled.p`
//   text-align: center;
//   font-size: 1.2rem;
//   color: red;
//   margin-top: 2rem;
// `;

export default function TaskList({ tasks, setTasks, onOpenUpdateTaskModal, fetchTasks }) {
  // isLoading и error теперь управляются в Layout
  // Вместо этого можно добавить проверку на tasks === undefined или tasks === null если Layout еще не загрузил их

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  // useEffect для загрузки данных убран, так как tasks приходят через props

  const openDeleteModal = (taskId) => {
    setTaskToDeleteId(taskId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteTask = async () => {
    if (taskToDeleteId !== null) {
      console.log("Deleting task:", taskToDeleteId);
      // Предполагаем, что API для удаления выглядит так:
      // В реальном приложении URL и userID могут быть другими
      const userID = 1; // Placeholder, нужно получать ID текущего пользователя
      const apiUrl = `http://localhost:15614/tasks/${taskToDeleteId}?userID=${userID}`;

      try {
        const response = await fetch(apiUrl, { method: 'DELETE' });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        console.log(`Task ${taskToDeleteId} deleted successfully from API.`);
        // Обновляем состояние в Layout через setTasks или вызываем fetchTasks
        if (setTasks) {
             setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDeleteId));
        } else if (fetchTasks) {
            fetchTasks(); // Перезагружаем задачи
        }

      } catch (error) {
        console.error("Failed to delete task from API:", error);
        // Здесь можно показать уведомление пользователю
      } finally {
        closeDeleteModal();
      }
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus?.toUpperCase() === 'DONE' ? 'NEW' : 'DONE';
    console.log("Toggling status for task:", taskId, "from", currentStatus, "to", newStatus);

    // Оптимистичное обновление UI
    if (setTasks) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus.toLowerCase() } : task
          )
        );
    }


    // TODO: вызывать API для обновления task на бэкэнде
    // Пример PUT запроса (URL и тело запроса могут отличаться)
    // const taskToUpdate = tasks.find(t => t.id === taskId);
    // if (taskToUpdate) {
    //   try {
    //     const response = await fetch(`http://localhost:15614/tasks/${taskId}?userID=1`, { // userID - placeholder
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ ...taskToUpdate, status: newStatus.toLowerCase(), updateDate: new Date().toISOString() })
    //     });
    //     if (!response.ok) throw new Error('Failed to update task status on API');
    //     const updatedTask = await response.json();
    //     // Обновляем задачу в состоянии более свежими данными с сервера, если нужно
    //      if (setTasks) {
    //         setTasks(prevTasks =>
    //           prevTasks.map(task =>
    //             task.id === updatedTask.id ? updatedTask : task
    //           )
    //         );
    //      }
    //     console.log("Task status updated on API:", updatedTask);
    //   } catch (error) {
    //     console.error("Error updating task status on API:", error);
    //     // Откатываем изменение в UI в случае ошибки
    //     if (setTasks) {
    //         setTasks(prevTasks =>
    //           prevTasks.map(task =>
    //             task.id === taskId ? { ...task, status: currentStatus.toLowerCase() } : task
    //           )
    //         );
    //     }
    //   }
    // }
  };

  if (!tasks) { // Если tasks еще не загружены (например, Layout в состоянии isLoading)
    return <LoadingMessage>Загрузка задач...</LoadingMessage>;
  }
  // ErrorMessage не нужен, так как ошибка загрузки обрабатывается в Layout

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
            onDeleteTask={openDeleteModal}
            onToggleStatus={handleToggleStatus}
            onTaskClick={onOpenUpdateTaskModal} // Передаем функцию для открытия модалки редактирования
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
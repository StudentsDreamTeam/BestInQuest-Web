import Task from '../Task/Task.jsx';
import { styled } from 'styled-components';
// DeleteTaskConfirmationModal теперь управляется из Layout, убираем useState для него отсюда

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

export default function TaskList({ tasks, setTasks, onOpenUpdateTaskModal, onOpenDeleteConfirmModal, fetchTasks }) {
  // Состояния isDeleteModalOpen и taskToDeleteId убраны, теперь управляются в Layout

  const handleDeleteRequest = (taskId) => {
    // Эта функция теперь просто вызывает открытие модального окна подтверждения из Layout
    onOpenDeleteConfirmModal(taskId);
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus?.toUpperCase() === 'DONE' ? 'NEW' : 'DONE';
    console.log("Toggling status for task:", taskId, "from", currentStatus, "to", newStatus);

    if (setTasks) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus.toLowerCase() } : task
          )
        );
    }
    // TODO: API call for status update
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate && tasks.find(t => t.id === taskId)?.author?.id) { // Проверка, что автор есть и у него есть id
      try {
        const response = await fetch(`http://localhost:15614/tasks/${taskId}?userID=${taskToUpdate.author.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...taskToUpdate, status: newStatus.toLowerCase(), updateDate: new Date().toISOString() })
        });
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to update task status on API: ${response.status} ${errorBody}`);
        }
        const updatedTask = await response.json();
        if (setTasks) {
           setTasks(prevTasks =>
             prevTasks.map(task =>
               task.id === updatedTask.id ? updatedTask : task
             )
           );
        }
        console.log("Task status updated on API:", updatedTask);
      } catch (error) {
        console.error("Error updating task status on API:", error);
        if (setTasks) {
            setTasks(prevTasks =>
              prevTasks.map(task =>
                task.id === taskId ? { ...task, status: currentStatus.toLowerCase() } : task // Откат
              )
            );
        }
      }
    } else {
        console.warn("Cannot update status: task or author ID not found for task", taskId);
    }
  };

  if (!tasks) {
    return <LoadingMessage>Загрузка задач...</LoadingMessage>;
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
            onDeleteTask={handleDeleteRequest} // Переименовано для ясности, вызывает модалку подтверждения
            onToggleStatus={handleToggleStatus}
            onTaskClick={onOpenUpdateTaskModal}
          />
        ))}
      </TaskListComponent>
      {/* DeleteTaskConfirmationModal теперь рендерится в Layout */}
    </>
  );
}
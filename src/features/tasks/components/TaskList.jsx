import Task from './Task';
import { styled } from 'styled-components';
import { useTasks } from '../../../contexts/TasksContext';

const TaskListComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  overflow-y: auto;
  padding-bottom: 1rem;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 2rem;
`;

export default function TaskList({ onOpenUpdateTaskModal, onOpenDeleteConfirmModal }) {
  const { tasks, isLoadingTasks, tasksError } = useTasks();

  if (isLoadingTasks) {
    return <Message>Загрузка задач...</Message>;
  }

  if (tasksError) {
    return <Message>Ошибка загрузки задач: {tasksError}</Message>;
  }

  if (tasks.length === 0) {
    return <Message>Задач пока нет.</Message>;
  }

  return (
    <TaskListComponent>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onOpenUpdateModal={onOpenUpdateTaskModal}
          onOpenDeleteConfirmModal={onOpenDeleteConfirmModal}
        />
      ))}
    </TaskListComponent>
  );
}
import Task from '../Task/Task.jsx';
import { tasks } from '../../data.js';
import { styled } from 'styled-components';

const TaskListComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

export default function TaskList() {
  return (
    <TaskListComponent>
      {tasks.map((task, index) => (
        <Task key={index} task={task} />
      ))}
      
      Кнопка "добавить задачу"
    </TaskListComponent>
  );
};
import Task from '../Task/Task.jsx';
// import { tasks } from '../../../data.js';
import { styled } from 'styled-components';
import { useEffect, useState } from 'react';

const TaskListComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

export default function TaskList() {
  const [ data, setData ] = useState([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/task.json') // запрос к API
      const data = await response.json()
      setData(data)
    }

    fetchData()
  }, [])

  return (
    <TaskListComponent>
      {data.map((task, index) => (
        <Task key={index} task={task} />
      ))}
      
      Кнопка "добавить задачу"
    </TaskListComponent>
  );
};
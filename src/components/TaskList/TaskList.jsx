import React from 'react';
import './TaskList.css';

export default function TaskList() {
  const tasks = [
    { id: 1, title: 'Задача 1', description: 'Описание первой задачи' },
    { id: 2, title: 'Задача 2', description: 'Описание второй задачи' },
    { id: 3, title: 'Задача 3', description: 'Описание третьей задачи' },
  ];

  return (
    <main className="task-list-container">
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
};
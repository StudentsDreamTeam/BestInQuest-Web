import React from 'react';
import './ProjectList.css';

export default function ProjectList() {
  const projects = [
    { id: 1, title: 'Проект 1', description: 'Описание первого проекта' },
    { id: 2, title: 'Проект 2', description: 'Описание второго проекта' },
    { id: 3, title: 'Проект 3', description: 'Описание третьего проекта' },
  ];

  return (
    <main className="task-list-container">

      <div className="task-list">
        {projects.map(task => (
          <div key={task.id} className="task">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
      
    </main>
  );
};
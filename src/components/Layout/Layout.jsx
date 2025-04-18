import './Layout.css'
import { useState } from "react"

import Sidebar from "../Sidebar/Sidebar"
import Header from "../Header/Header"
import TaskList from "../TaskList/TaskList"
import ProjectList from "../ProjectList/ProjectList"

import avatar from '../../img/6d669c62-c6b7-434c-9ea7-76eae96c66a1.png'


export default function Layout() {
  const [ tab, setTab ] = useState('today')

  const user = {
    avatar: avatar,
    name: 'Василий Пупкин',
    level: 1,
    points: 200,
  };

  const tasks = [
    {
      title: 'Задача 1',
      startTime: '9:00',
      duration: '30 мин',
      projectName: 'Проект A',
      assignee: 'Иванов И.И.',
      sphere: 'Финансы',
      isCompleted: false,
    },
    {
      title: 'Задача 2',
      startTime: '10:00',
      duration: '45 мин',
      projectName: 'Проект B',
      assignee: 'Петров П.П.',
      sphere: 'Маркетинг',
      isCompleted: false,
    },
  ];

  return (
    <div className="layout">
      <Sidebar user={user} active={tab} onChange={current => setTab(current)}/>

      <div className="right-side">
      
        { tab === 'today' && (
          <>
            <Header />
            <TaskList tasks={tasks} />
          </>
        )}

        { tab === 'projects' && (
          <>
            <Header />
            <ProjectList />
          </>
        )}
        
      </div>
    </div>
  );
}
import Sidebar from "../Sidebar/Sidebar"
import Header from "../Header/Header"
import TaskList from "../TaskList/TaskList"
import './Layout.css'
import avatar from '../../img/6d669c62-c6b7-434c-9ea7-76eae96c66a1.png'
import { useEffect } from "react"

export default function Layout() {
  // const [ tab, setTab ] = useEffect('main')

  const user = {
    avatar: avatar, // Замените на реальный аватар
    name: 'Василий Пупкин',
    level: 1,
    points: 200,
  };

  return (
    <div className="layout">
      <Sidebar user={user}/>
      <div className="right-side">
        <Header />
        <TaskList />
      </div>
    </div>
  );
}
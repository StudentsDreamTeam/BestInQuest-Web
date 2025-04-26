import './Main.css'

import Header from "../Header/Header"
import TaskList from "../TaskList/TaskList"
import ProjectList from "../ProjectList/ProjectList"


export default function Main({ active }) {
  return (
    <>
      <div className='main'>
        { active === 'today' && (
          <>
            <Header />
            <TaskList />
          </>
        )}

        { active === 'projects' && (
          <>
            <Header />
            <ProjectList />
          </>
        )}
      </div>
    </>
  )
}
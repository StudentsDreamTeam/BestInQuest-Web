import './Task.css'
import me from '../../img/VasyaPupkin.png'
import boss from '../../img/Boss.png'
import sport from '../../img/Sport.png'

import { styled, css } from 'styled-components'
import { useState } from 'react'

import { ReactComponent as ActiveCheckIcon } from '../../icons/ActiveCheckIcon31.svg'
import { ReactComponent as PassiveCheckIcon } from '../../icons/PassiveCheckPurple31.svg'
import { ReactComponent as PassiveCheckImportantIcon } from '../../icons/PassiveCheckImportantIcon31.svg'
import { ReactComponent as ActiveCheckImportantIcon } from '../../icons/ActiveCheckImportantIcon31.svg'
import { ReactComponent as TrashIcon } from '../../icons/TrashIcon34.svg'
import { ReactComponent as TimeIcon } from '../../icons/TimeIcon19.svg'
import { ReactComponent as TimeImportantIcon } from '../../icons/TimeImportantIcon19.svg'
import { ReactComponent as FolderIcon } from '../../icons/FolderIcon19.svg'
import { ReactComponent as FolderImportantIcon } from '../../icons/FolderImportantIcon19.svg'

import CheckButton from '../CheckButton/CheckButton'

const TaskContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 5.8rem;
  padding: 1.2rem 1rem;
  border-radius: 16px;

  color: #9747ff;
  background-color: #f5f5f5;

  ${({ $important }) =>
    $important &&
    css`
      background-color: #9747ff;
      color: #f5f5f5;
    `}  
`

export default function Task({ task }) {
  const [ isTaskCompleted, setIsTaskCompleted ] = useState(task.isCompleted)
  const [ isTaskImportant, setIsTaskImportant ] = useState(task.isImportant)

  return (
    <>
      <TaskContainer $important={isTaskImportant}>

        <CheckButton
          isImportant={isTaskImportant}
          onClick={() => setIsTaskCompleted(!isTaskCompleted)}
        >
          {isTaskCompleted ? (
            isTaskImportant ? (
              <ActiveCheckImportantIcon />
            ) : (
              <ActiveCheckIcon />
            )
          ) : (
            isTaskImportant ? (
              <PassiveCheckImportantIcon />
            ) : (
              <PassiveCheckIcon />
            )
          )}
        </CheckButton>

        <div className="task-details" style={{marginLeft: '2rem'}}>
          <div className="task-info">
            <div className="task-title">{task.title}</div>

            <div className="task-meta">
              { isTaskImportant ? <TimeImportantIcon/> : <TimeIcon/> }
              { task.startTime }
              &nbsp;&nbsp;
              { isTaskImportant ? <TimeImportantIcon/> : <TimeIcon/> }
              { task.duration }
              &nbsp;&nbsp;
              { isTaskImportant ? <FolderImportantIcon/> : <FolderIcon/> }
              { task.projectName }
              &nbsp;&nbsp;
              <div className="avatar">
                <img src={task.assignee === 'Я' ? me : boss} alt="User Avatar" />
              </div>
              {task.assignee}
              &nbsp;&nbsp;
              <div className="avatar">
                <img src={sport} alt="User Avatar" />
              </div>
              {task.sphere}
            </div>
          </div>
        </div>

        <div className="delete-container">
          <TrashIcon />
        </div>

      </TaskContainer>
    </>
  );
};
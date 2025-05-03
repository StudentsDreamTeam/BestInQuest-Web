import './Task.css'
import CheckButton from '../CheckButton/CheckButton'

import { styled, css } from 'styled-components'
import { useState } from 'react'

import userAvatar from '../../../img/userAvatar.png'
import bossAvatar from '../../../img/bossAvatar.png'
import sportAvatar from '../../../img/sportAvatar.png'
import { ReactComponent as ActiveCheckIcon } from '../../../icons/ActiveCheckIcon31.svg'
import { ReactComponent as PassiveCheckIcon } from '../../../icons/PassiveCheckPurple31.svg'
import { ReactComponent as PassiveCheckImportantIcon } from '../../../icons/PassiveCheckImportantIcon31.svg'
import { ReactComponent as ActiveCheckImportantIcon } from '../../../icons/ActiveCheckImportantIcon31.svg'
import { ReactComponent as TrashIcon } from '../../../icons/TrashIcon34.svg'
import { ReactComponent as TimeIcon } from '../../../icons/TimeIcon19.svg'
import { ReactComponent as TimeImportantIcon } from '../../../icons/TimeImportantIcon19.svg'
import { ReactComponent as FolderIcon } from '../../../icons/FolderIcon19.svg'
import { ReactComponent as FolderImportantIcon } from '../../../icons/FolderImportantIcon19.svg'

const TaskContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 5.8rem;
  padding: 1.2rem 1rem;
  border-radius: 16px;

  color: #9747ff;
  background-color: #f5f5f5;

  ${({ $priority }) =>
    $priority &&
    css`
      background-color: #9747ff;
      color: #f5f5f5;
    `}  
`

const TaskInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;

  height: 100%;
  margin-left: 2rem;

  color: #9747ff;
  ${({ $priority }) =>
    $priority &&
    css`
      color: #f5f5f5;
    `}  
`

const TaskDataObject = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-right: 2rem;
`


export default function Task({ task }) {
  const [ isTaskCompleted, setIsTaskCompleted ] = useState(task.status)
  const [ isTaskImportant, setIsTaskImportant ] = useState(task.priority)

  return (
    <>
      <TaskContainer $priority={isTaskImportant}>

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

        <TaskInfo $priority={isTaskImportant}>
          <div className="task-rows">
            <div className="task-title">{task.title}</div>

            <div className="task-data">
              <TaskDataObject>
                { isTaskImportant ? <TimeImportantIcon/> : <TimeIcon/> }
                { task.startTime }
              </TaskDataObject>
              
              <TaskDataObject>
                { isTaskImportant ? <TimeImportantIcon/> : <TimeIcon/> }
                { task.duration }
              </TaskDataObject>
              
              <TaskDataObject>
                { isTaskImportant ? <FolderImportantIcon/> : <FolderIcon/> }
                { task.projectName }
              </TaskDataObject>
              
              <TaskDataObject>
                <img src={task.author === 'Вася Пупкин' ? userAvatar : bossAvatar} alt="User Avatar" />
                {task.author}
              </TaskDataObject>
              
              <TaskDataObject>
                <img src={sportAvatar} alt="User Avatar" />
                {task.sphere}
              </TaskDataObject>
            </div>
          </div>
        </TaskInfo>

        <div className="delete-container">
          <TrashIcon />
        </div>

      </TaskContainer>
    </>
  );
};
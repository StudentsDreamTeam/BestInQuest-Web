import './Task.css'; // Keep for existing styles if not migrating all to styled-components yet
import CheckButton from '../CheckButton/CheckButton';

import { styled, css } from 'styled-components';
import { useState, useEffect } from 'react'; // Added useEffect

import userAvatar from '../../../img/userAvatar.png';
import bossAvatar from '../../../img/bossAvatar.png';
import sportAvatar from '../../../img/sportAvatar.png'; // Assuming this is for sphere
import { ReactComponent as ActiveCheckIcon } from '../../../icons/ActiveCheckIcon31.svg';
import { ReactComponent as PassiveCheckIcon } from '../../../icons/PassiveCheckPurple31.svg';
import { ReactComponent as PassiveCheckImportantIcon } from '../../../icons/PassiveCheckImportantIcon31.svg';
import { ReactComponent as ActiveCheckImportantIcon } from '../../../icons/ActiveCheckImportantIcon31.svg';
import { ReactComponent as TrashIcon } from '../../../icons/TrashIcon34.svg';
// import { ReactComponent as TrashImportantIcon } from '../../../icons/TrashImportantIcon34.svg'; // If you have this for important tasks
import { ReactComponent as TimeIcon } from '../../../icons/TimeIcon19.svg';
import { ReactComponent as TimeImportantIcon } from '../../../icons/TimeImportantIcon19.svg';
import { ReactComponent as FolderIcon } from '../../../icons/FolderIcon19.svg';
import { ReactComponent as FolderImportantIcon } from '../../../icons/FolderImportantIcon19.svg';

const TaskContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5.8rem;
  padding: 1.2rem 1rem;
  border-radius: 16px;
  color: #9747ff;
  background-color: #f5f5f5;
  transition: background-color 0.3s, color 0.3s; // Smooth transition

  ${({ $priority }) =>
    $priority &&
    css`
      background-color: #9747ff;
      color: #f5f5f5;
    `}
`;

const TaskInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 100%;
  margin-left: 2rem;
  color: #9747ff; // Default color

  ${({ $priority }) =>
    $priority &&
    css`
      color: #f5f5f5; // Color for important tasks
    `}
`;

const TaskDataObject = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem; // Slightly increased gap
  margin-right: 1.5rem; // Adjusted margin
  font-size: 0.8rem; // Slightly larger for readability
`;

// Placeholder for avatar based on sphere or type, more scalable than author name
const getSphereAvatar = (sphere) => {
  // Example: map sphere to avatar
  if (sphere?.toLowerCase() === 'спорт') return sportAvatar;
  // Add more mappings or a default avatar
  return sportAvatar; // Defaulting to sportAvatar for now
}

const getAuthorAvatar = (authorName) => {
  if (authorName === 'Василий Пупкин') return userAvatar;
  if (authorName === 'Тренер Аркадий Паровозов' || authorName === 'Отец Федор Пупкин') return bossAvatar; // Example
  return userAvatar; // Default
}


export default function Task({ task, onDeleteTask, onToggleStatus }) { // Added props for callbacks
  // Local state for visual feedback, actual update should be handled by parent via callbacks
  const [isTaskCompleted, setIsTaskCompleted] = useState(task.status);
  const [isTaskImportant, setIsTaskImportant] = useState(task.priority);

  // Sync local state if props change from parent
  useEffect(() => {
    setIsTaskCompleted(task.status);
    setIsTaskImportant(task.priority);
  }, [task.status, task.priority]);

  const handleToggleComplete = () => {
    // Optimistically update UI
    setIsTaskCompleted(!isTaskCompleted);
    // Call parent handler to update actual data
    if (onToggleStatus) {
      onToggleStatus(task.id, !isTaskCompleted);
    }
  };

  const handleDelete = () => {
    if (onDeleteTask) {
      onDeleteTask(task.id);
    } else {
      console.warn("onDeleteTask handler not provided to Task component for ID:", task.id);
    }
  };
  
  // Determine which icons to use based on priority
  const CurrentTimeIcon = isTaskImportant ? TimeImportantIcon : TimeIcon;
  const CurrentFolderIcon = isTaskImportant ? FolderImportantIcon : FolderIcon;
  const CheckIconToShow = isTaskCompleted
    ? (isTaskImportant ? ActiveCheckImportantIcon : ActiveCheckIcon)
    : (isTaskImportant ? PassiveCheckImportantIcon : PassiveCheckIcon);

  return (
    <TaskContainer $priority={isTaskImportant}>
      <CheckButton
        isImportant={isTaskImportant}
        onClick={handleToggleComplete} // Use the new handler
      >
        <CheckIconToShow />
      </CheckButton>

      <TaskInfo $priority={isTaskImportant}>
        <div className="task-rows"> {/* Keep class if styles exist in Task.css */}
          <div className="task-title">{task.title}</div>
          <div className="task-data">
            {task.startTime && (
              <TaskDataObject>
                <CurrentTimeIcon />
                <span>{task.startTime}</span>
              </TaskDataObject>
            )}
            {task.duration && (
              <TaskDataObject>
                <CurrentTimeIcon /> {/* Or a different duration icon */}
                <span>{task.duration}</span>
              </TaskDataObject>
            )}
            {task.projectName && (
              <TaskDataObject>
                <CurrentFolderIcon />
                <span>{task.projectName}</span>
              </TaskDataObject>
            )}
            {task.author && (
              <TaskDataObject>
                <img src={getAuthorAvatar(task.author)} alt={`${task.author} avatar`} />
                <span>{task.author}</span>
              </TaskDataObject>
            )}
            {task.sphere && (
              <TaskDataObject>
                 <img src={getSphereAvatar(task.sphere)} alt={`${task.sphere} avatar`} />
                <span>{task.sphere}</span>
              </TaskDataObject>
            )}
          </div>
        </div>
      </TaskInfo>

      <div className="delete-container" onClick={handleDelete} style={{ cursor: 'pointer' }}>
        <TrashIcon /> 
        {/* {isTaskImportant ? <TrashImportantIcon /> : <TrashIcon />} You might want a different trash icon for important tasks */}
      </div>
    </TaskContainer>
  );
}
import './Task.css';
import CheckButton from '../../CheckButton/CheckButton';
import { styled, css } from 'styled-components';

import defaultUserAvatar from '../../../assets/img/userAvatar.png';
import defaultBossAvatar from '../../../assets/img/bossAvatar.png';
import sportAvatar from '../../../assets/img/sportAvatar.png';
import workAvatar from '../../../assets/img/workAvatar.png';
import selfDevelopmentAvatar from '../../../assets/img/selfDevelopmentAvatar.png';


import { ReactComponent as ActiveCheckIcon } from '../../../assets/icons/ActiveCheckIcon31.svg';
import { ReactComponent as ActiveCheckImportantIcon } from '../../../assets/icons/ActiveCheckImportantIcon31.svg';

import { ReactComponent as PassiveCheckIcon } from '../../../assets/icons/PassiveCheckIcon31.svg';
import { ReactComponent as PassiveCheckPurpleIcon } from '../../../assets/icons/PassiveCheckImportantIcon31.svg';

import { ReactComponent as TrashIcon } from '../../../assets/icons/TrashIcon34.svg';
import { ReactComponent as TrashImportantIcon } from '../../../assets/icons/TrashImportantIcon34.svg';

import { ReactComponent as TimeIcon } from '../../../assets/icons/TimeIcon19.svg';
import { ReactComponent as TimeImportantIcon } from '../../../assets/icons/TimeImportantIcon19.svg';

import { IMPORTANT_PRIORITIES } from '../../../constants'; // DIFFICULTY_LABELS не используется здесь

const TaskContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto;
  min-height: 5.8rem;
  padding: 1.2rem 1rem;
  border-radius: 16px;
  color: #9747ff;
  background-color: #f5f5f5;
  transition: background-color 0.3s, color 0.3s;

  ${({ $isImportant }) =>
    $isImportant &&
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
  color: #9747ff;
  cursor: pointer; // Делаем TaskInfo кликабельным для редактирования

  ${({ $isImportant }) =>
    $isImportant &&
    css`
      color: #f5f5f5;
    `}
  
  &:hover {
    opacity: 0.8; // Небольшой эффект при наведении
  }
`;

const TaskDataGrid = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.75rem;
  font-weight: 600;
  gap: 0.5rem 1rem;
`;

const TaskDataObject = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;

  img {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    object-fit: cover;
  }
  svg {
    flex-shrink: 0;
  }
  span {
    word-break: break-word;
  }
`;

const getSphereAvatar = (sphere) => {
  switch (sphere?.toLowerCase()) {
    case 'sport': return sportAvatar;
    case 'work': return workAvatar;
    case 'self-development': return selfDevelopmentAvatar;
    // Добавьте другие кейсы при необходимости
    // case 'study': return studyAvatar;
    // case 'household': return householdAvatar;
    default: return sportAvatar; 
  }
};


export default function Task({ task, onDeleteTask, onToggleStatus, onTaskClick }) {
  const isTaskImportant = IMPORTANT_PRIORITIES.includes(task.priority?.toUpperCase());
  const isTaskCompleted = task.status?.toUpperCase() === 'DONE';

  const handleToggleComplete = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события на TaskInfo
    if (onToggleStatus) {
      onToggleStatus(task.id, task.status);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события на TaskInfo
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
  };

  const handleTaskInfoClick = () => {
    if (onTaskClick) {
      onTaskClick(task); // Передаем всю задачу в обработчик
    }
  };

  const CurrentTimeIcon = isTaskImportant ? TimeImportantIcon : TimeIcon;

  let CheckIconToShow;
  if (isTaskCompleted) {
    CheckIconToShow = isTaskImportant ? ActiveCheckImportantIcon : ActiveCheckIcon;
  } else {
    CheckIconToShow = isTaskImportant ? PassiveCheckPurpleIcon : PassiveCheckIcon;
  }

  const CurrentTrashIcon = isTaskImportant ? TrashImportantIcon : TrashIcon;
  const authorName = task.author?.name || 'Неизвестный автор';
  const executorName = task.executor?.name || 'Не назначен';

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Нет дедлайна';
    try {
      return new Date(dateString).toLocaleString('ru-RU', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const formatDurationTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      seconds = 0;
    }

    if (seconds < 60) {
      return `${seconds} сек`;
    }

    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);

    if (hours > 0) {
      if (minutes > 0) {
        return `${hours} ч ${minutes} мин`;
      } else {
        return `${hours} ч`;
      }
    } else {
      return `${minutes} мин`;
    }
  };

  return (
    <TaskContainer $isImportant={isTaskImportant}>
      <CheckButton
        isImportant={isTaskImportant}
        onClick={handleToggleComplete}
      >
        <CheckIconToShow />
      </CheckButton>

      <TaskInfo $isImportant={isTaskImportant} onClick={handleTaskInfoClick}>
        <div className="task-rows">
          <div className="task-title">{task.title || 'Без названия'}</div>

          <TaskDataGrid>
            <TaskDataObject title={`Дедлайн: ${formatDateTime(task.deadline)}`}>
              <CurrentTimeIcon />
              <span>{formatDateTime(task.deadline)}</span>
            </TaskDataObject>

            <TaskDataObject title={`Продолжительность: ${formatDurationTime(task.duration)}`}>
              <CurrentTimeIcon />
              <span>{formatDurationTime(task.duration)}</span>
            </TaskDataObject>
            
            <TaskDataObject title={`Автор: ${authorName}`}>
              <img src={defaultBossAvatar} alt="author" />
              <span>{authorName}</span>
            </TaskDataObject>

            <TaskDataObject title={`Исполнитель: ${executorName}`}>
              <img src={defaultUserAvatar} alt="executor" />
              <span>{executorName}</span>
            </TaskDataObject>

            <TaskDataObject title={`Сфера: ${task.sphere}`}>
              <img src={getSphereAvatar(task.sphere)} alt={task.sphere || 'сфера'} />
              <span>{task.sphere || 'Не указана'}</span>
            </TaskDataObject>       
          </TaskDataGrid>
        </div>
      </TaskInfo>

      <div className="delete-container" onClick={handleDelete} style={{ cursor: 'pointer' }}>
        <CurrentTrashIcon />
      </div>
    </TaskContainer>
  );
}
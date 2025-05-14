import './Task.css';
import CheckButton from '../CheckButton/CheckButton';
import { styled, css } from 'styled-components';

import defaultUserAvatar from '../../../img/userAvatar.png';
import defaultBossAvatar from '../../../img/bossAvatar.png';
import sportAvatar from '../../../img/sportAvatar.png';
import workAvatar from '../../../img/workAvatar.png';
// import studyAvatar from '../../../img/studyAvatar.png'; // Пример
// import householdAvatar from '../../../img/householdAvatar.png'; // Пример
import selfDevelopmentAvatar from '../../../img/selfDevelopmentAvatar.png'; // Пример


import { ReactComponent as ActiveCheckIcon } from '../../../icons/ActiveCheckIcon31.svg';
import { ReactComponent as ActiveCheckImportantIcon } from '../../../icons/ActiveCheckImportantIcon31.svg';

import { ReactComponent as PassiveCheckIcon } from '../../../icons/PassiveCheckIcon31.svg';
import { ReactComponent as PassiveCheckPurpleIcon } from '../../../icons/PassiveCheckImportantIcon31.svg';

import { ReactComponent as TrashIcon } from '../../../icons/TrashIcon34.svg';
import { ReactComponent as TrashImportantIcon } from '../../../icons/TrashImportantIcon34.svg';

import { ReactComponent as TimeIcon } from '../../../icons/TimeIcon19.svg';
import { ReactComponent as TimeImportantIcon } from '../../../icons/TimeImportantIcon19.svg';

import { IMPORTANT_PRIORITIES, DIFFICULTY_LABELS } from '../../../constants';

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

  ${({ $isImportant }) =>
    $isImportant &&
    css`
      color: #f5f5f5;
    `}
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
    // case 'study': return studyAvatar; // Предполагаем, что 'Учеба' будет 'study'
    // case 'household': return householdAvatar; // 'Быт'
    case 'self-development': return selfDevelopmentAvatar; // 'Саморазвитие'
    default: return sportAvatar; // Фолбэк
  }
};


export default function Task({ task, onDeleteTask, onToggleStatus }) {
  const isTaskImportant = IMPORTANT_PRIORITIES.includes(task.priority?.toUpperCase());
  const isTaskCompleted = task.status?.toUpperCase() === 'DONE';

  const handleToggleComplete = () => {
    if (onToggleStatus) {
      onToggleStatus(task.id, task.status);
    }
  };

  const handleDelete = () => {
    if (onDeleteTask) {
      onDeleteTask(task.id);
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
      return dateString; // Возвращаем исходную строку в случае ошибки
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

      <TaskInfo $isImportant={isTaskImportant}>
        <div className="task-rows">
          <div className="task-title">{task.title || 'Без названия'}</div>

          <TaskDataGrid>
            <TaskDataObject title={`Дедлайн: ${formatDateTime(task.deadline)}`}>
              <CurrentTimeIcon />
              <span>{formatDateTime(task.deadline)}</span>
            </TaskDataObject>

            <TaskDataObject title={`Продолжительность: ${formatDateTime(task.duration)}`}>
              <CurrentTimeIcon />
              <span>{formatDurationTime(task.duration)}</span>
            </TaskDataObject>
            
            <TaskDataObject title={`Автор: ${authorName}`}>
              <img src={task.author?.avatar || defaultBossAvatar} alt="author" />
              <span>{authorName}</span>
            </TaskDataObject>

            <TaskDataObject title={`Исполнитель: ${executorName}`}>
              <img src={task.executor?.avatar || defaultUserAvatar} alt="executor" />
              <span>{executorName}</span>
            </TaskDataObject>

            <TaskDataObject title={`Сфера: ${task.sphere}`}>
              <img src={getSphereAvatar(task.sphere)} alt={task.sphere} />
              <span>{task.sphere}</span>
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
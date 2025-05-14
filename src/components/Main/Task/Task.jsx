import './Task.css';
import CheckButton from '../CheckButton/CheckButton';
import { styled, css } from 'styled-components';
// Removed useState and useEffect for local state, status/priority now derived from props
// import { useState, useEffect } from 'react';

import defaultUserAvatar from '../../../img/userAvatar.png'; // Placeholder
import defaultBossAvatar from '../../../img/bossAvatar.png'; // Placeholder
import sportAvatar from '../../../img/sportAvatar.png'; // Placeholder

import { ReactComponent as ActiveCheckIcon } from '../../../icons/ActiveCheckIcon31.svg';
import { ReactComponent as PassiveCheckIcon } from '../../../icons/PassiveCheckPurple31.svg';
import { ReactComponent as PassiveCheckImportantIcon } from '../../../icons/PassiveCheckImportantIcon31.svg';
import { ReactComponent as ActiveCheckImportantIcon } from '../../../icons/ActiveCheckImportantIcon31.svg';
import { ReactComponent as TrashIcon } from '../../../icons/TrashIcon34.svg';
import { ReactComponent as TimeIcon } from '../../../icons/TimeIcon19.svg';
import { ReactComponent as TimeImportantIcon } from '../../../icons/TimeImportantIcon19.svg';
import { ReactComponent as FolderIcon } from '../../../icons/FolderIcon19.svg';
import { ReactComponent as FolderImportantIcon } from '../../../icons/FolderImportantIcon19.svg';

// Импорт констант
import { IMPORTANT_PRIORITIES, DIFFICULTY_LABELS } from '../../../constants';

// (Styled components TaskContainer, TaskInfo, TaskDataObject остаются в основном те же)
const TaskContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto; // Сделаем авто, т.к. данных может быть больше
  min-height: 5.8rem;
  padding: 1.2rem 1rem;
  border-radius: 16px;
  color: #9747ff;
  background-color: #f5f5f5;
  transition: background-color 0.3s, color 0.3s;

  ${({ $isImportant }) => // Изменено с $priority на $isImportant для ясности
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
    flex-shrink: 0; // Предотвратить сжатие иконок
  }
  span {
    word-break: break-word; // Перенос длинных слов
  }
`;

const getDynamicAvatar = (object) => {
  if (object === "boss") return defaultBossAvatar;
  if (object === "sport") return sportAvatar;
  // Здесь могла бы быть логика для выбора аватара по ID пользователя или другим данным
  // Пока просто плейсхолдер
  return object?.avatar || defaultUserAvatar;
};

export default function Task({ task, onDeleteTask, onToggleStatus }) {
  // Определяем "важность" и "завершенность" на основе пропсов
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
  const CurrentFolderIcon = isTaskImportant ? FolderImportantIcon : FolderIcon;
  const CheckIconToShow = isTaskCompleted
    ? (isTaskImportant ? ActiveCheckImportantIcon : ActiveCheckIcon)
    : (isTaskImportant ? PassiveCheckImportantIcon : PassiveCheckIcon);

  const difficultyText = DIFFICULTY_LABELS[task.difficulty] || `Уровень ${task.difficulty}`;
  const authorName = task.author?.name || 'Неизвестный автор';
  const executorName = task.executor?.name || 'Не назначен';

  const formatDate = (dateString) => {
    if (!dateString) return 'Нет';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Нет';
    try {
      return new Date(dateString).toLocaleString('ru-RU', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dateString;
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
        <div className="task-rows"> {/* .task-rows и .task-title из Task.css */}
          <div className="task-title">{task.title || 'Без названия'}</div>

          <TaskDataGrid>

            <TaskDataObject title={`Дедлайн: ${formatDateTime(task.deadline)}`}>
              <CurrentTimeIcon />
              <span>{formatDateTime(task.deadline)}</span>
            </TaskDataObject>

            {/* <TaskDataObject title={`Статус: ${task.status}`}>
              <CurrentFolderIcon />
              <span>{task.status || 'N/A'}</span>
            </TaskDataObject> */}

            {/* <TaskDataObject title={`Приоритет: ${task.priority}`}>
              <CurrentFolderIcon />
              <span>{task.priority || 'N/A'}</span>
            </TaskDataObject> */}
            
            {/* <TaskDataObject title={`Сложность: ${difficultyText}`}>
              <CurrentFolderIcon />
              <span>{difficultyText}</span>
            </TaskDataObject> */}
          
            <TaskDataObject title={`Автор: ${authorName}`}>
              <img src={getDynamicAvatar("boss")} alt="author" />
              <span>{authorName}</span>
            </TaskDataObject>

            <TaskDataObject title={`Исполнитель: ${executorName}`}>
              <img src={getDynamicAvatar(task.executor)} alt="executor" />
              <span>{executorName}</span>
            </TaskDataObject>

            <TaskDataObject>
              <img src={getDynamicAvatar("sport")} alt="sphere" />
              <span>{task.sphere}</span>
            </TaskDataObject>
            
          </TaskDataGrid>
        </div>
      </TaskInfo>

      <div className="delete-container" onClick={handleDelete} style={{ cursor: 'pointer' }}>
        <TrashIcon />
      </div>
    </TaskContainer>
  );
}
import CheckButton from '../../../components/CheckButton/CheckButton';
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

import { IMPORTANT_PRIORITIES_VALUES, STATUS_OPTIONS_MAP } from '../../../constants';
import { formatTaskCardDateTime, formatTaskCardDuration } from '../../../utils/dateTimeUtils';
import { useTasks } from '../../../contexts/TasksContext';


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
  cursor: pointer;

  ${({ $isImportant }) =>
    $isImportant &&
    css`
      color: #f5f5f5;
    `}
  
  &:hover {
    opacity: 0.8;
  }
`;
const TaskTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;
const TaskRows = styled.div`
  display: flex;
  flex-direction: column;
`;
const DeleteContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 3rem;
  height: 100%;
  justify-content: center;
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
    // case 'study': return studyAvatar;
    // case 'household': return householdAvatar;
    default: return sportAvatar;
  }
};

export default function Task({ task, onOpenUpdateModal, onOpenDeleteConfirmModal }) {
  const { toggleTaskStatus } = useTasks();

  const isTaskImportant = IMPORTANT_PRIORITIES_VALUES.includes(task.priority?.toLowerCase());
  const isTaskCompleted = task.status?.toLowerCase() === STATUS_OPTIONS_MAP.DONE;

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    toggleTaskStatus(task.id, task.status);
  };

  const handleDeleteRequest = (e) => {
    e.stopPropagation();
    if (onOpenDeleteConfirmModal) {
        onOpenDeleteConfirmModal(task.id);
    }
  };

  const handleTaskInfoClick = () => {
    if (onOpenUpdateModal) {
        onOpenUpdateModal(task);
    }
  };

  const CurrentTimeIcon = isTaskImportant ? TimeImportantIcon : TimeIcon;
  const CheckIconToShow = isTaskCompleted
    ? (isTaskImportant ? ActiveCheckImportantIcon : ActiveCheckIcon)
    : (isTaskImportant ? PassiveCheckPurpleIcon : PassiveCheckIcon);
  const CurrentTrashIcon = isTaskImportant ? TrashImportantIcon : TrashIcon;

  const authorName = task.author?.name || 'Неизвестный автор';
  const executorName = task.executor?.name || 'Не назначен';

  return (
    <TaskContainer $isImportant={isTaskImportant}>
      <CheckButton isImportant={isTaskImportant} onClick={handleToggleComplete}>
        <CheckIconToShow />
      </CheckButton>

      <TaskInfo $isImportant={isTaskImportant} onClick={handleTaskInfoClick}>
        <TaskRows>
          <TaskTitle>{task.title || 'Без названия'}</TaskTitle>
          <TaskDataGrid>
            <TaskDataObject title={`Дедлайн: ${formatTaskCardDateTime(task.deadline)}`}>
              <CurrentTimeIcon />
              <span>{formatTaskCardDateTime(task.deadline)}</span>
            </TaskDataObject>
            <TaskDataObject title={`Продолжительность: ${formatTaskCardDuration(task.duration)}`}>
              <CurrentTimeIcon />
              <span>{formatTaskCardDuration(task.duration)}</span>
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
              <img src={getSphereAvatar(task.sphere)} alt={task.sphere || 'сфера'} />
              <span>{task.sphere || 'Не указана'}</span>
            </TaskDataObject>
          </TaskDataGrid>
        </TaskRows>
      </TaskInfo>

      <DeleteContainer onClick={handleDeleteRequest}>
        <CurrentTrashIcon />
      </DeleteContainer>
    </TaskContainer>
  );
}
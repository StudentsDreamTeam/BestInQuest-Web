// FILE: .\src\components\UpdateTaskForm\UpdateTaskForm.jsx
import { styled, css } from 'styled-components';
import { useState, useEffect } from 'react';

import { ReactComponent as XPIcon } from '../../icons/XPIcon52x28.svg'
import { ReactComponent as StarIcon } from '../../icons/StarIcon41x37.svg'
import { ReactComponent as TrashIcon } from '../../icons/TrashIcon34.svg'
import { ReactComponent as CheckIcon } from '../../icons/CheckIcon52.svg'

import {
  DIFFICULTY_VALUES,
  DIFFICULTY_LABELS,
  SPHERE_OPTIONS,
  SPHERE_LABELS,
  PRIORITY_OPTIONS,
  PRIORITY_SLIDER_LABELS,
} from '../../constants';

// --- Основные контейнеры формы ---
const FormWrapper = styled.div`
  background-color: white; 
  padding: 3rem 5rem;
  border-radius: 20px;
  height: 100%;
  overflow-y: auto; // Добавлено для случая, если форма станет слишком высокой
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
`;

const FormMainContent = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-grow: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; 
  ${props => props.$left && css`flex: 2;`} 
  ${props => props.$right && css`flex: 1;`} 
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const FromFooterContent = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end; 
  position: relative; 
`;


// --- Общие элементы формы ---
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem; 
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// --- Элементы левой колонки ---
const TitleInput = styled.input`
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  outline: none;
  width: 100%;
  background-color: transparent;
  padding-bottom: 0.5rem;
  &::placeholder {
    color: #D9D9D9;
  }
`;

const DescriptionTextarea = styled.textarea`
  font-size: 1rem;
  font-weight: 600;
  border: none;
  min-height: 120px; 
  resize: vertical; 
  outline: none;
  width: 100%;
  background-color: transparent;
  line-height: 1.5;
  &::placeholder {
     color: #D9D9D9;
  }
`;

// --- Элементы правой колонки ---
const ControlContainer = styled.div`
  background-color: #F5F5F5;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
`;

const ControlStaticText = styled.span`
  font-size: 1.25rem; 
  font-weight: 600;
  color: black;
  margin-right: auto; 
`;

const ControlValueDisplay = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #777;
  margin-right: 0.75rem;
`;

const AddControlButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9747FF; 
  .icon-placeholder {
    width: 20px;
    height: 20px;
    font-size: 1.5rem; 
  }
  &:hover {
    opacity: 0.8;
  }
`;

const DateTimeInput = styled.input`
  margin-top: 0.5rem; 
  padding: 0.7rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #F9F9F9;
  width: 100%;
  color: #333;
`;

const TimeInput = styled.input.attrs({ type: 'time' })`
  margin-top: 0.5rem;
  padding: 0.7rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #F9F9F9;
  width: 100%;
  color: #333;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 30px; 
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
`;

const SliderTrackVisual = styled.div`
  position: absolute;
  width: calc(100% - 16px); 
  left: 8px; 
  height: 6px; 
  background-color: #F0F0F0; 
  border-radius: 3px; 
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between; 
  align-items: center;
  padding: 0; 
`;

const SliderDotVisual = styled.div`
  width: 8px; 
  height: 8px; 
  background-color: #D0D0D0; 
  border-radius: 1px; 
`;

const SliderInput = styled.input.attrs({ type: 'range' })`
  width: 100%;
  height: 100%; 
  cursor: pointer;
  background: transparent; 
  -webkit-appearance: none;
  appearance: none;
  position: relative; 
  z-index: 2; 

  &::-webkit-slider-runnable-track {
    height: 6px; 
    background: linear-gradient(to right, 
      #9747FF 0%, 
      #9747FF ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%, 
      transparent ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%, 
      transparent 100%); 
    border-radius: 3px;
  }
  &::-moz-range-track {
    height: 6px; 
    background: #F0F0F0;  
    border-radius: 3px;
  }
   &::-moz-range-progress { 
    background-color: #9747FF;
    height: 6px; 
    border-radius: 3px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #9747FF;
    border-radius: 2px; 
    cursor: pointer;
    margin-top: -5px; 
    position: relative;
    z-index: 3; 
  }
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #9747FF;
    border-radius: 2px;
    border: none;
    cursor: pointer;
    position: relative;
    z-index: 3;
  }
`;

const SliderLabel = styled.span`
  font-size: 0.9rem;
  color: #777;
  text-align: right;
  font-weight: 500;
`;

const SphereSelectContainer = styled.div`
  position: relative;
  background-color: #F0F0F0; 
  border-radius: 8px;
  
  &::after { 
    content: '>'; 
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%) ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
    transition: transform 0.2s ease-in-out;
    color: #777;
    pointer-events: none; 
    font-size: 1rem; 
    font-weight: bold;
  }
`;

const ActualStyledSelect = styled.select`
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1rem; 
  border: none; 
  border-radius: 8px; 
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.value === "" ? '#777' : '#333'}; 
  background-color: transparent; 
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  outline: none;
`;

// --- Элементы футера ---
const RewardsMainContainer = styled.div`
  display: flex;
  gap: 2rem; 
  align-items: flex-start; 
`;

const RewardCategoryBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
`;

const RewardCategoryTitle = styled.p`
  font-size: 0.95rem; 
  font-weight: 600; 
  color: #333;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const RewardItemsGroup = styled.div` 
  display: flex;
  gap: 1rem; 
`;

const IndividualRewardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem; 
`;

const RewardIconPlaceholder = styled.div`
  width: auto; 
  height: 40px; 
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg { 
    height: 100%;
    width: auto;
  }
`;

const RewardInput = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1px solid #E0E0E0; 
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600; 
  width: 90px; 
  text-align: center; 
  background-color: #F9F9F9; 
  color: #333;
  -moz-appearance: textfield; 
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { 
    -webkit-appearance: none;
    margin: 0;
  }
`;

const CreationDateDisplay = styled.div`
  color: #777;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  margin: 0 1rem; 
  align-self: flex-end; 
  padding-bottom: 0.5rem; 
  flex-grow: 1; // Позволяет занять доступное пространство между наградами и кнопками
`;

const FooterActionsContainer = styled.div`
  display: flex;
  align-items: center; 
  gap: 1rem; 
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem; 
  background-color: transparent;
  border: none;
  color: #B0B0B0; 
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem; 
  
  &:hover {
    color: #888;
  }

  .icon-placeholder { 
    width: 34px; 
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SaveButton = styled.button`
  background-color: #9747FF; 
  color: white; 
  border: none;
  border-radius: 20px; 
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 0; 
  
  &:hover {
    background-color: #823cdf;
  }
  
  .icon-placeholder { 
    width: 52px; 
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        width: 100%; 
        height: 100%;
    }
  }
`;

// --- Helper Functions ---
const formatDateTimeForInput = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
        console.error("Error formatting date for input:", e);
        return '';
    }
};

const secondsToHHMM = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds === undefined || totalSeconds < 0 || isNaN(totalSeconds)) return "00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const hhMMToSeconds = (hhmmString) => {
    if (!hhmmString) return 0;
    const parts = hhmmString.split(':');
    if (parts.length !== 2) return 0;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours * 3600 + minutes * 60;
};


export default function UpdateTaskForm({ taskToEdit, loggedInUser, onClose, onTaskUpdated }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    sphere: '',
    priority: 2, 
    difficulty: 2, 
    deadline: '', 
    duration: 3600, 
    fastDoneBonus: 0,
    rewardXp: 0,
    rewardCurrency: 0,
    linkedTaskId: null,
    combo: false,
  });

  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [isSphereSelectOpen, setIsSphereSelectOpen] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      const priorityIndex = PRIORITY_OPTIONS.indexOf(taskToEdit.priority?.toUpperCase());
      setTaskData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        sphere: taskToEdit.sphere || '',
        priority: priorityIndex !== -1 ? priorityIndex : 2,
        difficulty: typeof taskToEdit.difficulty === 'number' ? taskToEdit.difficulty : 2,
        deadline: taskToEdit.deadline ? formatDateTimeForInput(taskToEdit.deadline) : '',
        duration: typeof taskToEdit.duration === 'number' ? taskToEdit.duration : 3600,
        fastDoneBonus: typeof taskToEdit.fastDoneBonus === 'number' ? taskToEdit.fastDoneBonus : 0,
        rewardXp: typeof taskToEdit.rewardXp === 'number' ? taskToEdit.rewardXp : 0,
        rewardCurrency: typeof taskToEdit.rewardCurrency === 'number' ? taskToEdit.rewardCurrency : 0,
        linkedTaskId: taskToEdit.linkedTaskId !== undefined ? taskToEdit.linkedTaskId : null,
        combo: typeof taskToEdit.combo === 'boolean' ? taskToEdit.combo : false,
      });
    }
  }, [taskToEdit]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (["difficulty", "rewardXp", "fastDoneBonus", "priority", "rewardCurrency"].includes(name)) {
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue)) processedValue = 0;
    }
    
    if (name === "difficulty") {
        const maxVal = DIFFICULTY_VALUES[DIFFICULTY_VALUES.length -1];
        if (processedValue < DIFFICULTY_VALUES[0]) processedValue = DIFFICULTY_VALUES[0];
        if (processedValue > maxVal) processedValue = maxVal;
    } else if (name === "priority") {
        const maxVal = PRIORITY_OPTIONS.length - 1;
        if (processedValue < 0) processedValue = 0;
        if (processedValue > maxVal) processedValue = maxVal;
    }

    setTaskData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleDeadlineInputChange = (e) => {
    setTaskData(prev => ({ ...prev, deadline: e.target.value }));
    setShowDeadlinePicker(false); 
  };
  
  const formatDeadlineDisplay = (deadlineISOOrInput) => { // Может принимать как ISO, так и формат инпута
    if (!deadlineISOOrInput) return "Не выбран";
    try {
      // Пытаемся создать дату. Если это уже формат инпута YYYY-MM-DDTHH:MM, он тоже распарсится
      const date = new Date(deadlineISOOrInput);
      if (isNaN(date.getTime())) return "Ошибка даты"; // Проверка на валидность даты
      return date.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');
    } catch (e) {
      return "Ошибка даты";
    }
  };

  const formatDurationForDisplay = (totalSeconds) => {
    if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
      return "Не выбрана";
    }
    if (totalSeconds === 0) return "0 мин";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let parts = [];
    if (hours > 0) parts.push(`${hours} ч`);
    if (minutes > 0) parts.push(`${minutes} мин`);
    
    return parts.length > 0 ? parts.join(' ') : "0 мин";
  };

  const handleDurationInputChange = (e) => {
    const newDurationInSeconds = hhMMToSeconds(e.target.value);
    setTaskData(prev => ({ ...prev, duration: newDurationInSeconds }));
    setShowDurationPicker(false);
  };

  const formatCreationDate = (dateString) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return 'Неверная дата';
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskToEdit || !taskToEdit.id) {
        console.error("Ошибка: Задача для редактирования не определена.");
        return;
    }
    if (!loggedInUser || !loggedInUser.id) {
        console.error("Ошибка: Пользователь не определен. Невозможно обновить задачу.");
        return;
    }

    const finalTaskDataForApi = {
      // Передаем только те поля, которые API ожидает для обновления
      // id и linkedTaskId обычно не меняются или управляются отдельно
      // author и executor также обычно не меняются через простое редактирование задачи
      // status может меняться, но не через эту форму (из TaskList)
      
      id: taskToEdit.id, // ID нужен для идентификации задачи на бэкенде
      linkedTaskId: taskData.linkedTaskId, 
      title: taskData.title,
      description: taskData.description,
      sphere: taskData.sphere,
      
      status: taskToEdit.status, // Статус берем из оригинальной задачи, т.к. форма его не меняет
      priority: PRIORITY_OPTIONS[taskData.priority].toLowerCase(),
      difficulty: taskData.difficulty,
      
      updateDate: new Date().toISOString(), 
      deadline: taskData.deadline ? new Date(taskData.deadline).toISOString() : null, 
      duration: taskData.duration,

      fastDoneBonus: taskData.fastDoneBonus,
      combo: taskData.combo, 
      rewardXp: taskData.rewardXp,
      rewardCurrency: taskData.rewardCurrency,
      
      author: taskToEdit.author, 
      executor: taskToEdit.executor,
    };

    console.log('Данные задачи для обновления (API):', finalTaskDataForApi);

    const apiUrl = `http://localhost:15614/tasks/${taskToEdit.id}?userID=${loggedInUser.id}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalTaskDataForApi),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ошибка API: ${response.status} - ${errorData}`);
      }

      const updatedTaskFromApi = await response.json();
      console.log('Задача успешно обновлена (API):', updatedTaskFromApi);
      if (onTaskUpdated) {
        onTaskUpdated(updatedTaskFromApi); 
      }
      onClose(); 
    } catch (error) {
      console.error('Не удалось обновить задачу через API:', error);
      // onClose(); // Можно не закрывать, чтобы пользователь видел ошибку или мог исправить
    }
  };
  
  const handleDeleteClick = async () => {
    if (!taskToEdit || !taskToEdit.id || !loggedInUser || !loggedInUser.id) {
      console.error("Недостаточно данных для удаления задачи.");
      return;
    }
    console.log("Кнопка 'Удалить задачу' нажата для задачи ID:", taskToEdit.id);
    
    const apiUrl = `http://localhost:15614/tasks/${taskToEdit.id}?userID=${loggedInUser.id}`;
    try {
      const response = await fetch(apiUrl, { method: 'DELETE' });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error при удалении: ${response.status} - ${errorText}`);
      }
      console.log(`Задача ${taskToEdit.id} успешно удалена через API из формы редактирования.`);
      if (onTaskUpdated) { // Используем onTaskUpdated для сигнализации об изменении (удалении)
        // Передаем null или специальный объект, чтобы Layout/TaskList поняли, что задача удалена
        onTaskUpdated({ ...taskToEdit, _deleted: true }); 
      }
      onClose();
    } catch (error) {
      console.error("Не удалось удалить задачу через API из формы редактирования:", error);
    }
  };

  if (!taskToEdit) {
    return <FormWrapper>Загрузка данных задачи...</FormWrapper>; 
  }

  return (
    <FormWrapper>
      <StyledForm onSubmit={handleSubmit}>

        <FormMainContent>
          <FormColumn $left>
            <FormGroup>
              <TitleInput
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Заголовок"
                required
              />
            </FormGroup>
            <FormGroup>
              <DescriptionTextarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Описание задачи"
              />
            </FormGroup>
          </FormColumn>

          <FormColumn $right>
            <FormGroup>
              <ControlContainer>
                <ControlStaticText>Дедлайн</ControlStaticText>
                <ControlValueDisplay>{formatDeadlineDisplay(taskData.deadline)}</ControlValueDisplay>
                <AddControlButton type="button" onClick={() => setShowDeadlinePicker(!showDeadlinePicker)}>
                  <span className="icon-placeholder">+</span>
                </AddControlButton>
              </ControlContainer>
              {showDeadlinePicker && (
                <DateTimeInput
                  type="datetime-local"
                  name="deadline"
                  value={taskData.deadline} 
                  onChange={handleDeadlineInputChange}
                />
              )}
            </FormGroup>

            <FormGroup>
              <ControlContainer>
                <ControlStaticText>Продолжительность</ControlStaticText>
                <ControlValueDisplay>{formatDurationForDisplay(taskData.duration)}</ControlValueDisplay>
                <AddControlButton type="button" onClick={() => setShowDurationPicker(!showDurationPicker)}>
                   <span className="icon-placeholder">+</span>
                </AddControlButton>
              </ControlContainer>
              {showDurationPicker && (
                <TimeInput
                  name="duration_time_picker" 
                  value={secondsToHHMM(taskData.duration)}
                  onChange={handleDurationInputChange}
                />
              )}
            </FormGroup>


            <FormGroup>
              <SectionTitle>
                Важность
                <SliderLabel>{PRIORITY_SLIDER_LABELS[taskData.priority] || PRIORITY_SLIDER_LABELS[2]}</SliderLabel>
              </SectionTitle>
              <SliderContainer>
                <SliderTrackVisual>
                  {PRIORITY_OPTIONS.map((_, index) => ( 
                    <SliderDotVisual key={index} />
                  ))}
                </SliderTrackVisual>
                <SliderInput
                  name="priority"
                  min="0"
                  max={PRIORITY_OPTIONS.length - 1}
                  step="1"
                  value={taskData.priority}
                  onChange={handleChange}
                />
              </SliderContainer>
            </FormGroup>
            
            <FormGroup>
              <SectionTitle>
                Сложность
                <SliderLabel>{DIFFICULTY_LABELS[taskData.difficulty] || DIFFICULTY_LABELS[2]}</SliderLabel>
              </SectionTitle>
              <SliderContainer>
                <SliderTrackVisual>
                  {DIFFICULTY_VALUES.map(value => (
                    <SliderDotVisual key={value} />
                  ))}
                </SliderTrackVisual>
                <SliderInput
                  name="difficulty"
                  min={DIFFICULTY_VALUES[0]}
                  max={DIFFICULTY_VALUES[DIFFICULTY_VALUES.length - 1]}
                  step="1"
                  value={taskData.difficulty}
                  onChange={handleChange}
                />
              </SliderContainer>
            </FormGroup>

            <FormGroup>
              <SphereSelectContainer $isOpen={isSphereSelectOpen}>
                <ActualStyledSelect
                  name="sphere"
                  value={taskData.sphere}
                  onChange={handleChange}
                  onFocus={() => setIsSphereSelectOpen(true)}
                  onBlur={() => setIsSphereSelectOpen(false)}
                  onClick={() => setIsSphereSelectOpen(!isSphereSelectOpen)}
                >
                  <option value={""} disabled={taskData.sphere !== ""}>
                    Выбрать сферу
                  </option>
                  {SPHERE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{SPHERE_LABELS[opt] || opt}</option>
                  ))}
                </ActualStyledSelect>
              </SphereSelectContainer>
            </FormGroup>
          </FormColumn>
        </FormMainContent>

        <FromFooterContent>
          <RewardsMainContainer>
            <RewardCategoryBlock>
              <RewardCategoryTitle>Награда</RewardCategoryTitle>
              <RewardItemsGroup>
                <IndividualRewardItem>
                  <RewardIconPlaceholder><XPIcon /></RewardIconPlaceholder>
                  <RewardInput type="number" name="rewardXp" value={taskData.rewardXp} onChange={handleChange} min="0" />
                </IndividualRewardItem>
                <IndividualRewardItem>
                  <RewardIconPlaceholder><StarIcon /></RewardIconPlaceholder>
                  <RewardInput type="number" name="rewardCurrency" value={taskData.rewardCurrency} onChange={handleChange} min="0" />
                </IndividualRewardItem>
              </RewardItemsGroup>
            </RewardCategoryBlock>

            <RewardCategoryBlock>
              <RewardCategoryTitle>Бонус за скорость</RewardCategoryTitle>
              <RewardItemsGroup> 
                <IndividualRewardItem>
                  <RewardIconPlaceholder><XPIcon /></RewardIconPlaceholder>
                  <RewardInput type="number" name="fastDoneBonus" value={taskData.fastDoneBonus} onChange={handleChange} min="0" />
                </IndividualRewardItem>
              </RewardItemsGroup>
            </RewardCategoryBlock>
          </RewardsMainContainer>
          
          <CreationDateDisplay>
            Обновлена: {formatCreationDate(taskToEdit.updateDate)}
          </CreationDateDisplay>
          
          <FooterActionsContainer>
            <DeleteButton type="button" onClick={handleDeleteClick} title="Удалить задачу">
              <span className="icon-placeholder">
                <TrashIcon />
              </span>
              Удалить задачу
            </DeleteButton>
            
            <SaveButton type="submit" title="Сохранить изменения">
              <span className="icon-placeholder">
                <CheckIcon />
              </span>
            </SaveButton>
          </FooterActionsContainer>
        </FromFooterContent>
      </StyledForm>
    </FormWrapper>
  );
}
import { styled, css } from 'styled-components';
import { useState } from 'react';

import { ReactComponent as XPIcon } from '../../icons/XPIcon52x28.svg'
import { ReactComponent as StarIcon } from '../../icons/StarIcon41x37.svg'
import { ReactComponent as TrashIcon } from '../../icons/TrashIcon34.svg'
import { ReactComponent as CheckIcon } from '../../icons/CheckIcon52.svg'
// import { ReactComponent as PlusIcon } from '../../icons/PlusIcon19.svg'; // For Add buttons


import {
  DIFFICULTY_VALUES,
  DIFFICULTY_LABELS,
  SPHERE_OPTIONS,
  SPHERE_LABELS,
  PRIORITY_OPTIONS,
  PRIORITY_SLIDER_LABELS,
  STATUS_OPTIONS,
} from '../../constants';

// --- Основные контейнеры формы ---
const FormWrapper = styled.div`
  background-color: white; 
  padding: 3rem 5rem;
  border-radius: 20px;
  height: 100%;
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

// Renamed from FormBottomContent
const FromFooterContent = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Aligns items to the bottom of the flex line, useful if heights differ */
`;


// --- Общие элементы формы ---
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem; /* Added margin for spacing between form groups */
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
// Общий стиль для контролов типа Дедлайн, Продолжительность
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
  font-size: 1.25rem; /* Adjusted to match DeadlineStaticText original size if needed, or keep smaller */
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
    font-size: 1.5rem; /* Larger plus icon */
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


// Общие стили для слайдеров (Сложность и Важность)
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

// Сфера
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

// --- Элементы футера (бывший FormBottomContent) ---
const RewardsMainContainer = styled.div`
  display: flex;
  gap: 2rem; /* Gap between "Награда" block and "Бонус" block */
  align-items: flex-start; 
`;

const RewardCategoryBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
`;

const RewardCategoryTitle = styled.p`
  font-size: 0.95rem; /* Slightly larger for category title */
  font-weight: 600; /* Bolder */
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
  gap: 0.6rem; /* Gap between icon and input */
`;

const RewardIconPlaceholder = styled.div`
  width: auto; // Auto width to fit icon
  height: 40px; // Standard height for icons like XP, Star
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg { // Ensure SVGs scale correctly
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

const FooterActionsContainer = styled.div`
  display: flex;
  align-items: center; /* Vertically align buttons if they have different heights */
  gap: 1rem; /* Gap between delete and save buttons */
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
  border: none;
  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 0;
  
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


export default function CreateTaskForm({ onClose, loggedInUser }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    sphere: '',

    priority: 2,
    difficulty: 2,
    
    deadline: '', 
    duration: 3600,

    fastDoneBonus: 200,
    rewardXp: 200,
    rewardCurrency: 200,
  });

  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [isSphereSelectOpen, setIsSphereSelectOpen] = useState(false);


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
  
  const formatDeadlineDisplay = (deadlineISO) => {
    if (!deadlineISO) return "Не выбран";
    try {
      const date = new Date(deadlineISO);
      return date.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');
    } catch (e) {
      return "Ошибка даты";
    }
  };

  const secondsToHHMM = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds === undefined || totalSeconds < 0) return "00:00";
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


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUser || !loggedInUser.id) {
        console.error("Ошибка: Пользователь не определен. Невозможно создать задачу.");
        return;
    }

    const authorAndExecutorDetails = {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
    };

    const finalTaskData = {
      // id: будет присвоен бэкендом
      linkedTaskId: 0,
      title: taskData.title,
      description: taskData.description,
      sphere: taskData.sphere,
      
      status: STATUS_OPTIONS[0].toLowerCase(), // new always
      priority: PRIORITY_OPTIONS[taskData.priority].toLowerCase(),
      difficulty: taskData.difficulty,
      
      updateDate: new Date().toISOString(),
      deadline: taskData.deadline || null,
      duration: taskData.duration,

      fastDoneBonus: taskData.fastDoneBonus,
      combo: taskData.combo, // false по умолчанию
      rewardXp: taskData.rewardXp,
      rewardCurrency: taskData.rewardCurrency,
      
      author: authorAndExecutorDetails,
      executor: authorAndExecutorDetails,
    };
    console.log('Данные задачи для отправки:', finalTaskData);

    const apiUrl = `http://localhost:15614/tasks/create?authorId=${loggedInUser.id}&executorId=${loggedInUser.id}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalTaskData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ошибка API: ${response.status} - ${errorData}`);
      }

      // const createdTask = await response.json();
      // console.log('Задача успешно создана (API):', createdTask);

      // Здесь можно добавить логику для обновления списка задач в UI,
      // например, через вызов onTaskCreated(createdTask)
      onClose(); // Закрываем форму после успешного создания
    } catch (error) {
      console.error('Не удалось создать задачу через API:', error);
      // Здесь можно показать пользователю сообщение об ошибке
      onClose();
    }
  };
  
  const handleDeleteClick = () => {
    console.log("Delete task button clicked.");
    onClose(); 
  };

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
                <SliderLabel>{PRIORITY_SLIDER_LABELS[taskData.priority]}</SliderLabel>
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
                <SliderLabel>{DIFFICULTY_LABELS[taskData.difficulty]}</SliderLabel>
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
          
          <FooterActionsContainer>
            <DeleteButton type="button" onClick={handleDeleteClick} title="Удалить задачу">
              <span className="icon-placeholder">
                <TrashIcon />
              </span>
              Удалить задачу
            </DeleteButton>
            
            <SaveButton type="submit" title="Сохранить задачу">
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
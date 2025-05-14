import { styled, css } from 'styled-components';
import { useState } from 'react';

import { ReactComponent as XPIcon } from '../../icons/XPIcon52x28.svg'
import { ReactComponent as StarIcon } from '../../icons/StarIcon41x37.svg'
import { ReactComponent as TrashIcon } from '../../icons/TrashIcon34.svg'
import { ReactComponent as CheckIcon } from '../../icons/CheckIcon52.svg'


import {
  DIFFICULTY_VALUES,
  DIFFICULTY_LABELS,
  SPHERE_OPTIONS,
  SPHERE_LABELS,
  PRIORITY_OPTIONS, // Импортируем для конвертации при сабмите
  PRIORITY_SLIDER_LABELS, // Импортируем новые метки
} from '../../constants';

// --- Основные контейнеры формы ---
const FormWrapper = styled.div`
  background-color: #fff; 
  padding: 3rem 4rem;
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

// Контейнер для верхнего контента (колонки) и нижнего контента (награды, кнопки)
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
`;

// Контейнер для двух верхних колонок (левая: название/описание, правая: дедлайн/сложность/сфера)
const FormMainContent = styled.div`
  display: flex;
  gap: 2.5rem;
  flex-grow: 1; /* Занимает доступное пространство перед BottomContent */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; 
  ${props => props.$left && css`flex: 2;`} 
  ${props => props.$right && css`flex: 1;`} 

  @media (max-width: 768px) {
    flex: 1;
  }
`;

// Контейнер для нижней части (награды и кнопки)
const FormBottomContent = styled.div`
  margin-top: 2rem; // Отступ от верхней части
  border-top: 1px solid #F0F0F0;
  padding-top: 1.5rem;
`;


// --- Общие элементы формы ---
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
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
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const DescriptionTextarea = styled.textarea`
  font-size: 1rem;
  font-weight: 500;
  border: none;
  min-height: 120px; 
  resize: vertical; 
  outline: none;
  width: 100%;
  background-color: transparent;
  line-height: 1.5;
  &::placeholder {
     color: #D9D9D9;
     font-size: 1rem;
     font-weight: 500;
  }
`;

// --- Элементы правой колонки ---

// Дедлайн
const DeadlineControlContainer = styled.div`
  background-color: #F0F0F0;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px; // Чтобы соответствовать другим полям
`;

const DeadlineStaticText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-right: auto; // Отодвигает дату и кнопку вправо
`;

const DeadlineDateDisplay = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #777;
  margin-right: 0.75rem;
`;

const AddDeadlineButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9747FF; // Цвет плюсика
  .icon-placeholder {
    width: 20px;
    height: 20px;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const DateTimeInput = styled.input`
  margin-top: 0.5rem; // Отображается под серым блоком дедлайна
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
  height: 6px; // Увеличенная толщина трека
  background-color: #F0F0F0; 
  border-radius: 3px; // Скругление для толстого трека
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between; 
  align-items: center;
  padding: 0; // Убрал padding, чтобы точки были по всей ширине
`;

const SliderDotVisual = styled.div`
  width: 8px; // Размер квадратной точки
  height: 8px; // Размер квадратной точки
  background-color: #D0D0D0; 
  border-radius: 1px; // Слегка скругленные углы для "мягкого" квадрата
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
    height: 6px; // Увеличенная толщина трека
    background: linear-gradient(to right, 
      #9747FF 0%, 
      #9747FF ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%, 
      transparent ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%, 
      transparent 100%); // Фон трека теперь от SliderTrackVisual
    border-radius: 3px;
  }
  &::-moz-range-track {
    height: 6px; // Увеличенная толщина трека
    background: #F0F0F0;  // Базовый фон для Firefox
    border-radius: 3px;
  }
   &::-moz-range-progress { 
    background-color: #9747FF;
    height: 6px; // Увеличенная толщина трека
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
    margin-top: -5px; // (thumbHeight - trackHeight) / 2 = (16 - 6) / 2 = 5
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
const SPHERE_PLACEHOLDER_VALUE = ""; // Специальное значение для плейсхолдера
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
  color: ${props => props.value === SPHERE_PLACEHOLDER_VALUE ? '#777' : '#333'}; // Цвет для плейсхолдера
  background-color: transparent; 
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  outline: none;
`;

// --- Элементы нижней части ---
const RewardGroup = styled.div`
  /* Стили для RewardGroup не менялись, но теперь он будет частью FormBottomContent */
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const RewardLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem; 
`;

const RewardIconPlaceholder = styled.div`
  width: 24px; 
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  justify-content: space-between; 
  align-items: center;
  margin-top: 1.5rem; // Отступ от наград, если награды и кнопки в одном потоке
  /* Если RewardGroup и FooterActionsContainer будут flex-children в FormBottomContent, 
     то этот margin-top может быть не нужен или его нужно будет отрегулировать */
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem; 
  background-color: transparent;
  border: none;
  color: #B0B0B0; 
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem; 
  
  &:hover {
    color: #888;
  }

  .icon-placeholder { 
    width: 24px; 
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SaveButton = styled.button`
  background-color: #9747FF;
  color: white;
  border: none;
  border-radius: 50%; 
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(151, 71, 255, 0.3);
  transition: background-color 0.3s;
  &:hover {
    background-color: #823cdf;
  }
  
  .icon-placeholder { 
    width: 28px; 
    height: 28px;
  }
`;


export default function CreateTaskForm({ onClose, loggedInUser }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '', // ISO string YYYY-MM-DDTHH:mm or empty
    priority: 2, // Индекс для "NORMAL" (0: Optional, 1: Low, 2: Normal, 3: High, 4: Critical)
    difficulty: DIFFICULTY_VALUES[1], // Default: 1 (Легко)
    sphere: SPHERE_PLACEHOLDER_VALUE, // Пустое значение для плейсхолдера "Выбрать сферу"
    rewardXp: 200,
    fastDoneBonus: 200,
  });

  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [isSphereSelectOpen, setIsSphereSelectOpen] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (["difficulty", "rewardXp", "fastDoneBonus", "priority"].includes(name)) {
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue)) processedValue = 0;
    }
    
    if (name === "difficulty" || name === "priority" ) {
        const numValue = parseInt(value, 10);
        const maxVal = name === "difficulty" ? DIFFICULTY_VALUES[DIFFICULTY_VALUES.length -1] : PRIORITY_OPTIONS.length -1;
        if (numValue >= 0 && numValue <= maxVal) {
             processedValue = numValue;
        } else if (numValue < 0) {
            processedValue = 0;
        } else {
            processedValue = maxVal;
        }
    }

    setTaskData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleDeadlineInputChange = (e) => {
    setTaskData(prev => ({ ...prev, deadline: e.target.value }));
    setShowDeadlinePicker(false); // Скрываем календарь после выбора
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


  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTaskData = {
      ...taskData,
      id: Date.now(), 
      author: { id: loggedInUser?.id, name: loggedInUser?.name },
      updateDate: new Date().toISOString(),
      status: 'new', 
      priority: PRIORITY_OPTIONS[taskData.priority], // Конвертируем индекс в строку
      deadline: taskData.deadline || null, // Отправляем null если дедлайн не задан
    };

    console.log('Task data to be submitted:', finalTaskData);
    onClose();
  };
  
  const handleDeleteClick = () => {
    console.log("Delete task button clicked.");
    // onClose(); // Возможно, просто закрыть форму или показать модальное окно подтверждения
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
                placeholder="Сделать зарядку"
                required
              />
            </FormGroup>
            <FormGroup>
              <DescriptionTextarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Описание"
              />
            </FormGroup>
          </FormColumn>

          <FormColumn $right>
            <FormGroup>
              {/* <SectionTitle>Дедлайн</SectionTitle>  Убрали, т.к. текст теперь в самом контроле */}
              <DeadlineControlContainer>
                <DeadlineStaticText>Дедлайн</DeadlineStaticText>
                <DeadlineDateDisplay>{formatDeadlineDisplay(taskData.deadline)}</DeadlineDateDisplay>
                <AddDeadlineButton type="button" onClick={() => setShowDeadlinePicker(!showDeadlinePicker)}>
                  <span className="icon-placeholder">{/* <PlusIcon /> */} +</span>
                </AddDeadlineButton>
              </DeadlineControlContainer>
              {showDeadlinePicker && (
                <DateTimeInput
                  type="datetime-local"
                  name="deadline"
                  value={taskData.deadline}
                  onChange={handleDeadlineInputChange}
                  // onBlur={() => setShowDeadlinePicker(false)} // Можно скрывать по блюру
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
                  {PRIORITY_OPTIONS.map((_, index) => ( // Используем PRIORITY_OPTIONS для кол-ва точек
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
                  <option value={SPHERE_PLACEHOLDER_VALUE} disabled={taskData.sphere !== SPHERE_PLACEHOLDER_VALUE}>
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

        <FormBottomContent>
          <RewardGroup>
            <RewardItem>
              <RewardLabel>
                <RewardIconPlaceholder>
                  <XPIcon />
                </RewardIconPlaceholder>
                Награда
              </RewardLabel>
              <RewardInput type="number" name="rewardXp" value={taskData.rewardXp} onChange={handleChange} min="0" />
            </RewardItem>
            <RewardItem>
              <RewardLabel>
                <RewardIconPlaceholder>
                  <StarIcon />
                </RewardIconPlaceholder>
                Бонус за скорость
              </RewardLabel>
              <RewardInput type="number" name="fastDoneBonus" value={taskData.fastDoneBonus} onChange={handleChange} min="0" />
            </RewardItem>
          </RewardGroup>

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
        </FormBottomContent>
      </StyledForm>
    </FormWrapper>
  );
}
import { styled, css } from 'styled-components';
import { useState, useEffect } from 'react';
import Button from '../Button/Button'
import {
  // STATUS_OPTIONS, // Статус не выбирается в новой форме явно
  // PRIORITY_OPTIONS, // Приоритет не выбирается в новой форме явно
  DIFFICULTY_VALUES,
  DIFFICULTY_LABELS,
  SPHERE_OPTIONS,
  SPHERE_LABELS
} from '../../constants';

const FormWrapper = styled.div`
  background-color: #fff; // Фон всей модалки будет белым
  padding: 2rem;
  border-radius: 20px; // Скругление как на дизайне
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto; // Если контента много
`;

const FormContent = styled.div`
  display: flex;
  gap: 2.5rem; // Расстояние между левой и правой колонкой
  flex-grow: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // Расстояние между блоками в колонке
  ${props => props.left && css`flex: 2;`} // Левая колонка шире
  ${props => props.right && css`flex: 1;`} // Правая колонка уже

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #555; // Стандартный цвет для лейблов
`;

const TitleInput = styled.input`
  font-size: 1.8rem; // Большой шрифт для заголовка задачи
  font-weight: 600;
  padding: 0.5rem 0;
  border: none;
  border-bottom: 1px solid #eee;
  outline: none;
  width: 100%;
  &::placeholder {
    color: #ccc;
  }
`;

const DescriptionTextarea = styled.textarea`
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 120px;
  resize: vertical;
  outline: none;
  width: 100%;
  background-color: #f9f9f9;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
`;

const ToggleLabel = styled.span`
  font-size: 0.9rem;
  color: #333;
`;

const ToggleSwitch = styled.label` // Стилизованный переключатель
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  span { // Slider
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
    &:before { // Knob
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  input:checked + span {
    background-color: #9747FF; // Фиолетовый, когда активен
  }
  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const DateTimeInput = styled.input`
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #f9f9f9;
  margin-top: 0.5rem;
  width: 100%;
`;

const DifficultySlider = styled.input`
  width: 100%;
  cursor: pointer;
  margin-top: 0.5rem;
  accent-color: #9747FF; // Цвет ползунка
`;
const DifficultyLabel = styled.span`
  font-size: 0.9rem;
  color: #777;
  text-align: right;
`;

const SphereButton = styled(Button)` // Наследуем от существующей кнопки
  width: 100%;
  justify-content: space-between; // Для текста и шеврона
  background-color: #f0f0f0;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
  // Добавьте сюда стили для шеврона, если он будет частью кнопки
`;

const RewardGroup = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
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
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem; // Расстояние между иконкой и текстом
`;

const RewardIconPlaceholder = styled.div`
  width: 20px; height: 20px;
  /* background-color: #ccc; // Временный плейсхолдер для иконки */
  display: inline-block;
`;

const RewardInput = styled.input`
  padding: 0.5rem 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 80px; // Фиксированная ширина для поля ввода награды
  text-align: right;
  background-color: #f9f9f9;
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; // Кнопка справа
  margin-top: auto; // Прижимает кнопку вниз, если есть место
  padding-top: 1rem;
`;

const SaveButton = styled.button`
  background-color: #9747FF;
  color: white;
  border: none;
  border-radius: 50%; // Круглая кнопка
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
  // Сюда нужно будет вставить SVG галочки
  // Временная галочка текстом:
  font-size: 1.5rem; 
`;

// Календарь (очень упрощенный, для примера, если решите делать кастомный)
const CalendarModalContent = styled.div`
  padding: 1rem;
  h4 { margin-bottom: 1rem; }
  input[type="date"], input[type="time"] {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
  }
`;


export default function CreateTaskForm({ onClose, loggedInUser, onTaskCreated }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '', // ISO string YYYY-MM-DDTHH:mm
    hasDeadline: false,
    difficulty: DIFFICULTY_VALUES[1], // Default: 1 (Легко)
    sphere: SPHERE_OPTIONS[0],
    rewardXp: 0,
    fastDoneBonus: 0, // Раньше было rewardCurrency, теперь это бонус за скорость
    // Дополнительные поля из старой формы, если нужны, можно вернуть
    // status: STATUS_OPTIONS[0],
    // priority: PRIORITY_OPTIONS[2],
  });

  const [showCalendar, setShowCalendar] = useState(false); // Для кастомного календаря

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (["difficulty", "rewardXp", "fastDoneBonus"].includes(name)) {
      processedValue = parseInt(value, 10) || 0;
    }
    
    setTaskData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };
  
  const handleDeadlineChange = (e) => {
    // Если используется datetime-local, он уже в нужном формате
    // Если раздельные date и time, их нужно будет объединить
    setTaskData(prev => ({ ...prev, deadline: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTaskData = {
      ...taskData,
      id: Date.now(), // Временный ID
      author: { id: loggedInUser?.id, name: loggedInUser?.name },
      // executor: { id: null, name: 'Не назначен' }, // Исполнитель не задается в этой форме
      updateDate: new Date().toISOString(),
      status: 'new', // По умолчанию для новых задач
      priority: 'normal', // По умолчанию
      // Удаляем hasDeadline, т.к. он только для UI
    };
    if (!taskData.hasDeadline) {
        finalTaskData.deadline = null; // Если дедлайн не выбран, ставим null
    }
    delete finalTaskData.hasDeadline;

    console.log('Task data to be submitted:', finalTaskData);
    // if (onTaskCreated) {
    //   onTaskCreated(finalTaskData);
    // }
    onClose();
  };
  
  // Для кастомного календаря (если решите делать сложнее)
  // const openCalendar = () => setShowCalendar(true);
  // const closeCalendar = () => setShowCalendar(false);
  // const handleDateSelect = (selectedDate) => {
  //   setTaskData(prev => ({ ...prev, deadline: selectedDate, hasDeadline: true }));
  //   closeCalendar();
  // };

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <FormContent>
          <FormColumn left>
            <FormGroup>
              {/* <FormLabel htmlFor="taskTitle">Название задачи</FormLabel> */}
              <TitleInput
                id="taskTitle"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Сделать зарядку"
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="taskDescription">Описание</FormLabel>
              <DescriptionTextarea
                id="taskDescription"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Например: 1. Отжимания 2. Приседания"
              />
            </FormGroup>
          </FormColumn>

          <FormColumn right>
            <FormGroup>
              <SectionTitle>
                Дедлайн
                {/* <Button type="button" onClick={openCalendar} variant="icon">+</Button> // Для кастомного календаря */}
              </SectionTitle>
              <ToggleContainer>
                <ToggleLabel>Выбрано</ToggleLabel>
                <ToggleSwitch>
                  <input type="checkbox" name="hasDeadline" checked={taskData.hasDeadline} onChange={handleChange} />
                  <span></span>
                </ToggleSwitch>
              </ToggleContainer>
              {taskData.hasDeadline && (
                <DateTimeInput
                  type="datetime-local"
                  name="deadline"
                  value={taskData.deadline}
                  onChange={handleDeadlineChange}
                />
              )}
            </FormGroup>

            <FormGroup>
              <SectionTitle>
                Сложность
                <DifficultyLabel>{DIFFICULTY_LABELS[taskData.difficulty]}</DifficultyLabel>
              </SectionTitle>
              <DifficultySlider
                type="range"
                name="difficulty"
                min={DIFFICULTY_VALUES[0]}
                max={DIFFICULTY_VALUES[DIFFICULTY_VALUES.length - 1]}
                value={taskData.difficulty}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
               <FormLabel htmlFor="taskSphere">Сфера</FormLabel>
                <select // Используем обычный select, его можно стилизовать или заменить на кастомный компонент
                    id="taskSphere"
                    name="sphere"
                    value={taskData.sphere}
                    onChange={handleChange}
                    style={{ padding: '0.7rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: '#f9f9f9' }}
                >
                    {SPHERE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{SPHERE_LABELS[opt] || opt}</option>
                    ))}
                </select>
              {/* <SphereButton type="button" variant="secondary" onClick={() => alert('Выбор сферы (в разработке)')}>
                {SPHERE_LABELS[taskData.sphere] || taskData.sphere}
                <span>></span> 
              </SphereButton> */}
            </FormGroup>
          </FormColumn>
        </FormContent>

        <RewardGroup>
          <RewardItem>
            <RewardLabel>
              <RewardIconPlaceholder>{/* XP Icon */}</RewardIconPlaceholder>
              Награда
            </RewardLabel>
            <RewardInput type="number" name="rewardXp" value={taskData.rewardXp} onChange={handleChange} min="0" />
          </RewardItem>
          <RewardItem>
            <RewardLabel>
              <RewardIconPlaceholder>{/* Star Icon */}</RewardIconPlaceholder>
              Бонус за скорость
            </RewardLabel>
            <RewardInput type="number" name="fastDoneBonus" value={taskData.fastDoneBonus} onChange={handleChange} min="0" />
          </RewardItem>
        </RewardGroup>

        <SaveButtonContainer>
          <SaveButton type="submit" title="Сохранить задачу">
            ✓ {/* Замените на SVG галочку */}
          </SaveButton>
        </SaveButtonContainer>
      </form>
      {/* {showCalendar && (
        <Modal open={showCalendar} onClose={closeCalendar} modelType="default">
          <CalendarModalContent>
            <h4>Выберите дату и время</h4>
            <input type="date" onChange={(e) => handleDateSelect(e.target.value + (taskData.deadline ? taskData.deadline.substring(10) : 'T00:00'))} />
            <input type="time" onChange={(e) => handleDateSelect((taskData.deadline ? taskData.deadline.substring(0,10) : new Date().toISOString().substring(0,10)) + 'T' + e.target.value)} />
            <Button onClick={closeCalendar}>Закрыть</Button>
          </CalendarModalContent>
        </Modal>
      )} */}
    </FormWrapper>
  );
}
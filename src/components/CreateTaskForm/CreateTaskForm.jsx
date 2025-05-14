// src/components/CreateTaskForm/CreateTaskForm.jsx
import { styled } from 'styled-components';
import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  DIFFICULTY_VALUES,
  DIFFICULTY_LABELS,
} from '../../constants'; // Предполагаем, что константы здесь

// (Styled components остаются в основном без изменений, кроме, возможно, размеров)
const CreateTaskFormContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem 3rem; // Уменьшил паддинги для большего контента
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
const FormColumns = styled.div`
  display: flex;
  gap: 2rem;
  flex: 1;
  @media (max-width: 768px) { // Адаптивность для маленьких экранов
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem; // Промежуток между группами полей
`;

const RightColumn = styled.div`
  width: 300px; // Можно сделать flex: 0.7; или подобное для адаптивности
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem; // Уменьшил margin
`;

const Label = styled.label`
  font-size: 0.9rem; // Немного уменьшил
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #f9f9f9;
`;

const Textarea = styled.textarea`
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  background-color: #f9f9f9;
`;

const Select = styled.select`
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #f9f9f9;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  cursor: pointer;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee; // Разделитель
`;


export default function CreateTaskForm({ onClose, loggedInUser, onTaskCreated }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: STATUS_OPTIONS[0], // Default: NEW
    priority: PRIORITY_OPTIONS[2], // Default: NORMAL
    difficulty: DIFFICULTY_VALUES[1], // Default: 1 (Легко)
    // author будет установлен из loggedInUser
    executorName: '', // Поле для ввода имени исполнителя
    rewardXp: 0,
    rewardCurrency: 0,
    deadline: '', // ISO string YYYY-MM-DDTHH:MM
    fastDoneBonus: 0,
    combo: false,
    linkedTaskId: '', // Пустая строка для ID, т.к. может быть числом
  });

  // Устанавливаем автора при инициализации или изменении loggedInUser
  useEffect(() => {
    if (loggedInUser) {
      // Не меняем setTaskData напрямую в рендере, используем useEffect
      // Это поле не редактируется в форме, оно берется из loggedInUser
    }
  }, [loggedInUser]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    if (name === "difficulty" || name === "rewardXp" || name === "rewardCurrency" || name === "fastDoneBonus") {
      processedValue = parseInt(value, 10) || 0;
    } else if (name === "linkedTaskId") {
      processedValue = value === '' ? null : (parseInt(value, 10) || null); // null если пусто, иначе число
    }


    setTaskData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalTaskData = {
      ...taskData,
      id: Date.now(), // Временный ID для фронтенда, бэкенд должен генерировать свой
      author: { // Формируем объект автора
        id: loggedInUser?.id || null,
        name: loggedInUser?.name || 'Система',
        email: loggedInUser?.email || '',
        // ... другие поля из loggedInUser, если они нужны в структуре author
      },
      executor: { // Формируем объект исполнителя
        id: null, // ID исполнителя, если бы выбирали из списка
        name: taskData.executorName || 'Не назначен',
        email: '', // email исполнителя, если бы был
      },
      updateDate: new Date().toISOString(),
      // Удаляем временное поле executorName
    };
    delete finalTaskData.executorName;


    console.log('Task data to be submitted:', finalTaskData);
    // if (onTaskCreated) {
    //   onTaskCreated(finalTaskData); // Передать созданную задачу наверх для обновления UI
    // }
    onClose();
  };

  return (
    <CreateTaskFormContainer>
      <form onSubmit={handleSubmit}>
        <FormColumns>
          <LeftColumn>
            <FormField>
              <Label htmlFor="taskTitle">Название задачи *</Label>
              <Input
                id="taskTitle"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Например, прочитать главу книги"
                required
              />
            </FormField>

            <FormField>
              <Label htmlFor="taskDescription">Описание</Label>
              <Textarea
                id="taskDescription"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Детали задачи..."
              />
            </FormField>
            
            <FormField>
              <Label htmlFor="executorName">Исполнитель</Label>
              <Input
                id="executorName"
                name="executorName"
                value={taskData.executorName}
                onChange={handleChange}
                placeholder="Имя исполнителя"
              />
            </FormField>

            <FormField>
              <Label htmlFor="taskDeadline">Дедлайн</Label>
              <Input
                id="taskDeadline"
                type="datetime-local" // Для даты и времени
                name="deadline"
                value={taskData.deadline}
                onChange={handleChange}
              />
            </FormField>
          </LeftColumn>

          <RightColumn>
            <FormField>
              <Label htmlFor="taskStatus">Статус</Label>
              <Select id="taskStatus" name="status" value={taskData.status} onChange={handleChange}>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Select>
            </FormField>

            <FormField>
              <Label htmlFor="taskPriority">Приоритет</Label>
              <Select id="taskPriority" name="priority" value={taskData.priority} onChange={handleChange}>
                {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Select>
            </FormField>

            <FormField>
              <Label htmlFor="taskDifficulty">Сложность</Label>
              <Select id="taskDifficulty" name="difficulty" value={taskData.difficulty} onChange={handleChange}>
                {DIFFICULTY_VALUES.map(val => (
                  <option key={val} value={val}>{DIFFICULTY_LABELS[val]}</option>
                ))}
              </Select>
            </FormField>
            
            <FormField>
              <Label htmlFor="rewardXp">Награда XP</Label>
              <Input type="number" id="rewardXp" name="rewardXp" value={taskData.rewardXp} onChange={handleChange} min="0" />
            </FormField>

            <FormField>
              <Label htmlFor="rewardCurrency">Награда (валюта)</Label>
              <Input type="number" id="rewardCurrency" name="rewardCurrency" value={taskData.rewardCurrency} onChange={handleChange} min="0" />
            </FormField>

            <FormField>
              <Label htmlFor="fastDoneBonus">Бонус за скорость (XP)</Label>
              <Input type="number" id="fastDoneBonus" name="fastDoneBonus" value={taskData.fastDoneBonus} onChange={handleChange} min="0" />
            </FormField>
            
            <CheckboxContainer>
              <Input type="checkbox" id="combo" name="combo" checked={taskData.combo} onChange={handleChange} />
              <CheckboxLabel htmlFor="combo">Комбо задача</CheckboxLabel>
            </CheckboxContainer>

            <FormField>
              <Label htmlFor="linkedTaskId">Связанная задача (ID)</Label>
              <Input type="text" id="linkedTaskId" name="linkedTaskId" value={taskData.linkedTaskId === null ? '' : taskData.linkedTaskId} onChange={handleChange} placeholder="ID предыдущей задачи"/>
            </FormField>

          </RightColumn>
        </FormColumns>
        <ActionsContainer>
          <Button type="button" onClick={onClose} variant="secondary">Отмена</Button>
          <Button type="submit" isActive>Создать задачу</Button>
        </ActionsContainer>
      </form>
    </CreateTaskFormContainer>
  );
}
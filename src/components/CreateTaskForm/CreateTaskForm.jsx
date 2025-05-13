import { styled } from 'styled-components';
import { useState } from 'react';
import Button from '../Button/Button';

const CreateTaskFormContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 4rem 6rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto; // Added for scrollability if content overflows
`;
const FormColumns = styled.div`
  display: flex;
  gap: 2rem;
  flex: 1;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RightColumn = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f9f9f9;
`;

const Textarea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical; // Allow vertical resize
  background-color: #f9f9f9;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f9f9f9;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label` // Changed from div to label for better semantics
  font-size: 1rem;
  cursor: pointer; // Make label clickable for checkbox
`;

const RewardContainer = styled.div`
  display: flex;
  align-items: center; // Align items vertically
  gap: 1rem;
  margin-top: auto; // Pushes to bottom if LeftColumn has space
`;

const RewardInput = styled.input`
  width: 60px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
  background-color: #f9f9f9;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export default function CreateTaskForm({ onClose }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    projectName: '', // Added project name
    deadline: '',
    isImportant: false,
    difficulty: 'Легкотина', // Default difficulty
    sphere: '',
    rewards: [200, 200, 200, 200], // Example rewards
    speedBonus: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRewardChange = (index, value) => {
    const newRewards = [...taskData.rewards];
    // Ensure value is a number, default to 0 if not
    newRewards[index] = parseInt(value, 10) || 0; 
    setTaskData(prev => ({
      ...prev,
      rewards: newRewards
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual task creation logic (e.g., API call)
    console.log('Task data to be submitted:', taskData);
    // Example: map form data to backend structure if different
    // const backendTaskData = {
    //   ...taskData,
    //   priority: taskData.isImportant ? 'HIGH' : 'LOW', // if backend expects string
    //   difficulty: taskData.difficulty === 'Легкотина' ? 1 : (taskData.difficulty === 'Средняя' ? 2 : 3) // if backend expects number
    // };
    // console.log('Mapped task data for backend:', backendTaskData);
    onClose(); // Close modal after submission
  };

  return (
    <CreateTaskFormContainer>
      <form onSubmit={handleSubmit}>
        <FormColumns>

          <LeftColumn>
            <div> {/* Wrapper for top content in LeftColumn */}
              <FormField>
                <Label htmlFor="taskTitle">Название задачи</Label>
                <Input
                  id="taskTitle"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  placeholder="Сделать зарядку"
                  required // Example: make title required
                />
              </FormField>

              <FormField>
                <Label htmlFor="taskDescription">Описание</Label>
                <Textarea
                  id="taskDescription"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  placeholder="Подробное описание задачи..."
                />
              </FormField>
            </div>

            <RewardContainer>
              <Label>Награда:</Label> {/* No htmlFor needed as it's a general label for the group */}
              {taskData.rewards.map((reward, index) => (
                <RewardInput
                  key={index}
                  type="number"
                  value={reward}
                  onChange={(e) => handleRewardChange(index, e.target.value)}
                  aria-label={`Reward ${index + 1}`} // Accessibility for screen readers
                />
              ))}
            </RewardContainer>
          </LeftColumn>

          <RightColumn>
            <FormField>
              <Label htmlFor="projectName">Проект</Label>
              <Input
                id="projectName"
                name="projectName"
                value={taskData.projectName}
                onChange={handleChange}
                placeholder="Название проекта"
              />
            </FormField>

            <FormField>
              <Label htmlFor="taskDeadline">Дедлайн</Label>
              <Input
                id="taskDeadline"
                type="date"
                name="deadline"
                value={taskData.deadline}
                onChange={handleChange}
              />
            </FormField>

            <CheckboxContainer>
              <Input // Changed to Input for consistency, can be styled as checkbox
                type="checkbox"
                id="isImportant"
                name="isImportant"
                checked={taskData.isImportant}
                onChange={handleChange}
              />
              <CheckboxLabel htmlFor="isImportant">Важная</CheckboxLabel>
            </CheckboxContainer>

            <FormField>
              <Label htmlFor="taskDifficulty">Сложность</Label>
              <Select
                id="taskDifficulty"
                name="difficulty"
                value={taskData.difficulty}
                onChange={handleChange}
              >
                <option value="Легкотина">Легкотина</option>
                <option value="Средняя">Средняя</option>
                <option value="Сложная">Сложная</option>
              </Select>
            </FormField>

            <FormField>
              <Label htmlFor="taskSphere">Сфера</Label>
              <Input
                id="taskSphere"
                name="sphere"
                value={taskData.sphere}
                onChange={handleChange}
                placeholder="Выбрать сферу"
              />
            </FormField>

            <CheckboxContainer>
              <Input
                type="checkbox"
                id="speedBonus"
                name="speedBonus"
                checked={taskData.speedBonus}
                onChange={handleChange}
              />
              <CheckboxLabel htmlFor="speedBonus">Бонус за скорость</CheckboxLabel>
            </CheckboxContainer>

            <ActionsContainer>
              <Button type="button" onClick={onClose} variant="secondary">Отмена</Button>
              <Button type="submit" isActive>Создать</Button> {/* Added isActive for primary action style */}
            </ActionsContainer>
          </RightColumn>
          
        </FormColumns>
      </form>
    </CreateTaskFormContainer>
  );
}
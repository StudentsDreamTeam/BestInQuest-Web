import { styled } from 'styled-components'
import { useState } from 'react'
import Button from '../Button/Button'

const CreateTaskFormContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 4rem 6rem;
  display: flex;
  flex-direction: column;
`
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
  resize: none;
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

const CheckboxLabel = styled.label`
  font-size: 1rem;
`;

const RewardContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
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
    projectName: '',
    deadline: '',
    isImportant: false,
    difficulty: 'Легкотина',
    sphere: '',
    rewards: [200, 200, 200, 200],
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
    newRewards[index] = Number(value) || 0;
    setTaskData(prev => ({
      ...prev,
      rewards: newRewards
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Task data:', taskData);
    onClose();
  };

  return (
    <CreateTaskFormContainer>
      
      <form onSubmit={handleSubmit}>
        <FormColumns>

          <LeftColumn>
            <div>
              <FormField>
                <Input 
                  name="title" 
                  value={taskData.title} 
                  onChange={handleChange} 
                  placeholder="Сделать зарядку" 
                />
              </FormField>

              <FormField>
                <Textarea 
                  name="description" 
                  value={taskData.description} 
                  onChange={handleChange} 
                  placeholder="Описание" 
                />
              </FormField>
            </div>

            <RewardContainer>
              <Label>Награда:</Label>
              {taskData.rewards.map((reward, index) => (
                <RewardInput
                  key={index}
                  type="number"
                  value={reward}
                  onChange={(e) => handleRewardChange(index, e.target.value)}
                />
              ))}
            </RewardContainer>
          </LeftColumn>

          <RightColumn>
            {/* <FormField>
              <Label>Проект</Label>
              <Input 
                name="projectName" 
                value={taskData.projectName} 
                onChange={handleChange} 
                placeholder="Название проекта" 
              />
            </FormField> */}

            <FormField>
              <Label>Дедлайн</Label>
              <Input 
                type="date"
                name="deadline" 
                value={taskData.deadline} 
                onChange={handleChange} 
              />
            </FormField>

            <CheckboxContainer>
              <input 
                type="checkbox"
                name="isImportant" 
                checked={taskData.isImportant} 
                onChange={handleChange} 
              />
              <CheckboxLabel>Важная</CheckboxLabel>
            </CheckboxContainer>

            <FormField>
              <Label>Сложность</Label>
              <Select 
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
              <Label>Сфера</Label>
              <Input 
                name="sphere" 
                value={taskData.sphere} 
                onChange={handleChange} 
                placeholder="Выбрать сферу" 
              />
            </FormField>

            <CheckboxContainer>
              <input 
                type="checkbox"
                name="speedBonus" 
                checked={taskData.speedBonus} 
                onChange={handleChange} 
              />
              <CheckboxLabel>Бонус за скорость</CheckboxLabel>
            </CheckboxContainer>

            <ActionsContainer>
              <Button type="button" onClick={onClose} variant="secondary">Отмена</Button>
              <Button type="submit">Создать</Button>
            </ActionsContainer>
          </RightColumn>

        </FormColumns>
      </form>

    </CreateTaskFormContainer>
  );
}
// .\src\components\CreateTaskForm\CreateTaskForm.jsx
import { styled, css } from 'styled-components';
import { useState, useEffect } from 'react';
// import Button from '../Button/Button' // Not used in this version of the form as per design
import {
  DIFFICULTY_VALUES,
  DIFFICULTY_LABELS,
  SPHERE_OPTIONS,
  SPHERE_LABELS
} from '../../constants';

const FormWrapper = styled.div`
  background-color: #fff; 
  padding: 3rem 4rem;
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const FormContent = styled.div`
  display: flex;
  gap: 2.5rem; 
  flex-grow: 1;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  outline: none;
  width: 100%;
  background-color: transparent;
  padding-bottom: 0.5rem; // Added some padding to separate from potential elements below
  &::placeholder {
    color: #D9D9D9;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const DescriptionTextarea = styled.textarea`
  font-size: 1rem;
  font-weight: 500; // Adjusted font-weight to match design (less bold)
  border: none;
  min-height: 120px; 
  resize: vertical; 
  outline: none;
  width: 100%;
  background-color: transparent;
  line-height: 1.5; // Added for better readability
  &::placeholder {
     color: #D9D9D9;
     font-size: 1rem;
     font-weight: 500; // Adjusted font-weight
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem; // Adjusted margin
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem; // Added margin if DateTimeInput is shown
`;

const ToggleLabel = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  span { 
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
    &:before { 
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
    background-color: #9747FF; 
  }
  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const DateTimeInput = styled.input`
  padding: 0.7rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #F9F9F9;
  width: 100%;
  color: #333;
`;

// Difficulty Slider Styles
const DifficultySliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 30px; 
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
`;

const DifficultyTrackVisual = styled.div`
  position: absolute;
  width: calc(100% - 16px); /* Account for thumb size to align dots: 100% - thumbWidth */
  left: 8px; /* thumbWidth / 2 */
  height: 2px; /* Thickness of the main line */
  background-color: #F0F0F0; /* Light grey line for the track itself */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between; /* This will space out the dots */
  align-items: center;
  padding: 0 2px; /* Small padding so dots don't touch edges of their container */
`;

const DifficultyDotVisual = styled.div`
  width: 8px;
  height: 8px;
  background-color: #D0D0D0; /* Dots color */
  border-radius: 50%;
  /* No z-index needed, slider input is on top */
`;

const DifficultySliderInput = styled.input.attrs({ type: 'range' })`
  width: 100%;
  height: 100%; /* To make the clickable area cover the visual */
  cursor: pointer;
  background: transparent; 
  -webkit-appearance: none;
  appearance: none;
  position: relative; /* Changed from absolute to relative for stacking context */
  z-index: 2; 

  &::-webkit-slider-runnable-track {
    height: 2px;
    background: linear-gradient(to right, 
      #9747FF 0%, 
      #9747FF ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%, 
      #F0F0F0 ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%, 
      #F0F0F0 100%);
    border-radius: 1px;
  }
  &::-moz-range-track {
    height: 2px;
    background: #F0F0F0; 
    border-radius: 1px;
  }
   &::-moz-range-progress { /* For Firefox fill */
    background-color: #9747FF;
    height: 2px;
    border-radius: 1px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #9747FF;
    border-radius: 2px; /* Slightly rounded square for the thumb */
    cursor: pointer;
    margin-top: -7px; /* (thumbHeight - trackHeight) / 2 = (16 - 2) / 2 = 7 */
    position: relative;
    z-index: 3; /* Thumb above track fill */
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

const DifficultyLabel = styled.span`
  font-size: 0.9rem;
  color: #777;
  text-align: right;
  font-weight: 500;
`;

// Sphere Select Styles
const SphereSelectContainer = styled.div`
  position: relative;
  background-color: #F0F0F0; /* Grey background like a button */
  border-radius: 8px;
  
  &::after { /* Custom arrow */
    content: '>'; 
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%) ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}; // Basic rotation for open state
    transition: transform 0.2s ease-in-out;
    color: #777;
    pointer-events: none; 
    font-size: 1rem; 
    font-weight: bold;
  }
`;

const ActualStyledSelect = styled.select`
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1rem; /* Right padding for arrow, left for text */
  border: none; 
  border-radius: 8px; /* Match container */
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  background-color: transparent; /* Select itself is transparent */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  outline: none;

  &:focus + ::after { // Example: change arrow on focus, not standard
    /* color: #9747FF; */
  }
`;


const RewardGroup = styled.div`
  margin-top: 2rem; // Increased spacing
  border-top: 1px solid #F0F0F0; // Lighter separator
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
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem; // Increased gap for icon
`;

const RewardIconPlaceholder = styled.div`
  width: 24px; 
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: #ccc; // Placeholder color, remove when SVG is added
  // border-radius: 50%; // If icons are circular
`;

const RewardInput = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1px solid #E0E0E0; // Lighter border
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600; // Bolder font for the number
  width: 90px; 
  text-align: center; // Center the number
  background-color: #F9F9F9; // Light background
  color: #333;
  -moz-appearance: textfield; /* Firefox */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { /* Chrome, Safari, Edge, Opera */
    -webkit-appearance: none;
    margin: 0;
  }
`;

const FooterActionsContainer = styled.div`
  display: flex;
  justify-content: space-between; // Delete button left, Save button right
  align-items: center;
  margin-top: auto; 
  padding-top: 1.5rem;
  border-top: 1px solid #F0F0F0; // Lighter separator
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem; // Space between icon and text
  background-color: transparent;
  border: none;
  color: #B0B0B0; // Muted grey for text
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem; // Padding around icon and text
  
  &:hover {
    color: #888;
  }

  .icon-placeholder { // Class for SVG wrapper if needed
    width: 24px; // Adjust to your SVG size
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
  
  .icon-placeholder { // Class for SVG wrapper
    width: 28px; // Adjust to your SVG size
    height: 28px;
  }
`;


export default function CreateTaskForm({ onClose, loggedInUser, onTaskCreated }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '', 
    hasDeadline: false,
    difficulty: DIFFICULTY_VALUES[1], 
    sphere: SPHERE_OPTIONS[0],
    rewardXp: 200, // Default as per design
    fastDoneBonus: 200, // Default as per design
  });

  const [isSphereSelectOpen, setIsSphereSelectOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (["difficulty", "rewardXp", "fastDoneBonus"].includes(name)) {
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue)) processedValue = 0;
    }
    
    if (name === "difficulty" ) {
        const numValue = parseInt(value, 10);
        // Ensure value is within DIFFICULTY_VALUES bounds
        if (numValue >= DIFFICULTY_VALUES[0] && numValue <= DIFFICULTY_VALUES[DIFFICULTY_VALUES.length -1]) {
             processedValue = numValue;
        } else if (numValue < DIFFICULTY_VALUES[0]) {
            processedValue = DIFFICULTY_VALUES[0];
        } else {
            processedValue = DIFFICULTY_VALUES[DIFFICULTY_VALUES.length - 1];
        }
    }


    setTaskData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };

  const handleDeadlineChange = (e) => {
    setTaskData(prev => ({ ...prev, deadline: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTaskData = {
      ...taskData,
      id: Date.now(), 
      author: { id: loggedInUser?.id, name: loggedInUser?.name },
      updateDate: new Date().toISOString(),
      status: 'new', 
      priority: 'normal', 
    };

    if (!taskData.hasDeadline) {
        finalTaskData.deadline = null;
    }
    delete finalTaskData.hasDeadline;

    console.log('Task data to be submitted:', finalTaskData);
    // if (onTaskCreated) {
    //   onTaskCreated(finalTaskData); 
    // }
    onClose();
  };
  
  const handleDeleteClick = () => {
    // Here you would typically open a confirmation modal
    console.log("Delete task button clicked. ID to delete (if editing):", taskData.id);
    // For now, just logging, as the modal logic is separate.
    // If this form can also edit, you'd pass taskData.id to a delete function.
    // If it's only for new tasks, this button might not make sense here,
    // or it would simply clear the form / close it.
    // Based on the screenshot context (next to save), it implies action on the *current* task being created/edited.
  };


  return (
    <FormWrapper>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <FormContent>

          <FormColumn $left>
            <FormGroup>
              <TitleInput
                id="taskTitle"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Название задачи" // Placeholder from design: "Сделать зарядку"
                // For design "Сделать зарядку", you can set it as initial value:
                // defaultValue="Сделать зарядку" if you want it pre-filled and editable
                // Or, if placeholder should be "Название задачи" and user types "Сделать зарядку" then it's fine
              />
            </FormGroup>

            <FormGroup>
              <DescriptionTextarea
                id="taskDescription"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Описание"
              />
            </FormGroup>
          </FormColumn>

          <FormColumn $right>
            {/* "Проект" section removed as per instruction */}
            <FormGroup>
              <SectionTitle>
                Дедлайн
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
                  required={taskData.hasDeadline} 
                />
              )}
            </FormGroup>

            <FormGroup>
              <SectionTitle>
                Сложность
                <DifficultyLabel>{DIFFICULTY_LABELS[taskData.difficulty]}</DifficultyLabel>
              </SectionTitle>
              <DifficultySliderContainer>
                <DifficultyTrackVisual>
                  {DIFFICULTY_VALUES.map(value => (
                    <DifficultyDotVisual key={value} />
                  ))}
                </DifficultyTrackVisual>
                <DifficultySliderInput
                  name="difficulty"
                  min={DIFFICULTY_VALUES[0]}
                  max={DIFFICULTY_VALUES[DIFFICULTY_VALUES.length - 1]}
                  step="1" // Ensure discrete steps
                  value={taskData.difficulty}
                  onChange={handleChange}
                />
              </DifficultySliderContainer>
            </FormGroup>

            <FormGroup>
                <SectionTitle>
                  Сфера
                </SectionTitle>                 
                <SphereSelectContainer $isOpen={isSphereSelectOpen}>
                    <ActualStyledSelect
                        id="taskSphere"
                        name="sphere"
                        value={taskData.sphere}
                        onChange={handleChange}
                        onFocus={() => setIsSphereSelectOpen(true)}
                        onBlur={() => setIsSphereSelectOpen(false)}
                        onClick={() => setIsSphereSelectOpen(!isSphereSelectOpen)} // For touch devices, and to toggle state
                    >
                        {SPHERE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{SPHERE_LABELS[opt] || opt}</option>
                        ))}
                    </ActualStyledSelect>
                </SphereSelectContainer>
            </FormGroup>
          </FormColumn>
        </FormContent>

        <RewardGroup>
          <RewardItem>
            <RewardLabel>
              <RewardIconPlaceholder>{/* <XPIcon /> */}</RewardIconPlaceholder>
              Награда
            </RewardLabel>
            <RewardInput type="number" name="rewardXp" value={taskData.rewardXp} onChange={handleChange} min="0" />
          </RewardItem>
          <RewardItem>
            <RewardLabel>
              <RewardIconPlaceholder>{/* <StarIcon /> */}</RewardIconPlaceholder>
              Бонус за скорость
            </RewardLabel>
            <RewardInput type="number" name="fastDoneBonus" value={taskData.fastDoneBonus} onChange={handleChange} min="0" />
          </RewardItem>
        </RewardGroup>

        <FooterActionsContainer>
          <DeleteButton type="button" onClick={handleDeleteClick} title="Удалить задачу">
            <span className="icon-placeholder">{/* <TrashIcon /> */}</span>
            Удалить задачу
          </DeleteButton>
          <SaveButton type="submit" title="Сохранить задачу">
            <span className="icon-placeholder">{/* <CheckIcon /> */}</span>
          </SaveButton>
        </FooterActionsContainer>
      </form>
      </FormWrapper>
  );
}
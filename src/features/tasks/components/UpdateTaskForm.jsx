import TaskFormBase from './TaskFormBase';
import { useUser } from '../../../contexts/UserContext';
import { useTasks } from '../../../contexts/TasksContext';

export default function UpdateTaskForm({ taskToEdit, onClose, onInitiateDelete }) {
  const { user } = useUser();
  const { updateTask } = useTasks();

  const handleUpdateSubmit = async (formDataFromBase) => {
    if (!taskToEdit || !user) {
        console.error("Task or user not available for update");
        return;
    }
    try {
        await updateTask(taskToEdit.id, formDataFromBase); // Передаем только измененные данные
        onClose();
    } catch (error) {
        console.error("UpdateTaskForm: Failed to update task", error);
    }
  };

  if (!taskToEdit || !user) {
      return <div>Загрузка данных...</div>;
  }

  return (
    <TaskFormBase
      initialTaskData={taskToEdit}
      onSubmitForm={handleUpdateSubmit}
      onCloseForm={onClose}
      isUpdateForm={true}
      onInitiateDelete={onInitiateDelete}
      loggedInUser={user}
      taskToEdit={taskToEdit}
    />
  );
}
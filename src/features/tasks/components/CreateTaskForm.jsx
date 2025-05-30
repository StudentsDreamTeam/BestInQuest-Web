import TaskFormBase from './TaskFormBase';
import { useUser } from '../../../contexts/UserContext';
import { useTasks } from '../../../contexts/TasksContext';
import { STATUS_OPTIONS_MAP } from '../../../constants';

export default function CreateTaskForm({ onClose }) {
  const { user } = useUser();
  const { addTask } = useTasks();

  const defaultCreateData = {
    title: '',
    description: '',
    sphere: '',
    // priority и difficulty будут взяты из TaskFormBase по умолчанию
    deadline: '',
    duration: 3600,
    fastDoneBonus: 0,
    combo: false,
    rewardXp: 100,
    rewardCurrency: 10,
    linkedTaskId: 0,
  };

  const handleCreateSubmit = async (formDataFromBase) => {
    if (!user) {
        console.error("User not available for task creation");
        return;
    }

    const authorAndExecutorDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const finalTaskData = {
      ...formDataFromBase,
      status: STATUS_OPTIONS_MAP.NEW,
      author: authorAndExecutorDetails,
      executor: authorAndExecutorDetails,
      // updateDate будет установлен на сервере
    };

    try {
        await addTask(finalTaskData);
        onClose();
    } catch (error) {
        console.error("CreateTaskForm: Failed to add task", error);
    }
  };

  if (!user) {
      return <div>Загрузка данных пользователя...</div>;
  }

  return (
    <TaskFormBase
      initialTaskData={defaultCreateData}
      onSubmitForm={handleCreateSubmit}
      onCloseForm={onClose}
      isUpdateForm={false}
      loggedInUser={user}
    />
  );
}
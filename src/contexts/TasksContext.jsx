import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  fetchTasksByUserId,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  updateTaskStatus as updateTaskStatusApi,
} from '../features/tasks/services/taskApi';
import { useUser } from './UserContext';
import { STATUS_OPTIONS_MAP } from '../constants';

const TasksContext = createContext();

export function useTasks() {
  return useContext(TasksContext);
}

export function TasksProvider ({ children }) {
  const { user, isLoadingUser } = useUser();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const taskData = await fetchTasksByUserId(userId);
      setTasks(taskData);
      console.log("Tasks data loaded:", taskData);
    } catch (e) {
      console.error("Failed to load tasks:", e);
      setError(e.message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      loadTasks(user.id);
    } else if (!isLoadingUser && !user) {
        setIsLoading(false);
        setError("Не удалось загрузить задачи: пользователь не определен.");
        setTasks([]);
    } else if (isLoadingUser) {
        setIsLoading(true);
        setTasks([]);
        setError(null);
    }
  }, [user, isLoadingUser, loadTasks]);

  const addTask = async (taskDataFromForm) => {
    if (!user || !user.id) {
      throw new Error("Cannot create task: user not available.");
    }
    // setIsLoading(true);
    setError(null);
    try {
      const newTask = await createTaskApi(taskDataFromForm, user.id);
      // setTasks(newTask);
      setTasks(prevTasks => [newTask, ...prevTasks]
        // .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))// Сортировка по дате обновления
      );
      console.log("Task created:", newTask);
      return newTask;
    } catch (e) {
      console.error("Failed to add task:", e);
      setError(e.message);
      throw e;
    } finally {
      // setIsLoading(false);
    }
  };

  const updateTask = async (taskId, taskDataFromForm) => {
    if (!user || !user.id) {
      throw new Error("Cannot update task: user not available.");
    }
    // setIsLoading(true);
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) throw new Error(`Task with ID ${taskId} not found for update.`);

      const finalTaskData = {
        ...taskToUpdate, // Берем текущие author, executor, status, если они не пришли из формы
        ...taskDataFromForm, // Перезаписываем измененными данными из формы
        id: taskId,
        updateDate: new Date().toISOString(),
      };

      const updatedTask = await updateTaskApi(taskId, finalTaskData, user.id);
      setTasks(prevTasks =>
        prevTasks
          .map(t => (t.id === taskId ? updatedTask : t))
          // .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate)) // Сортировка
      );
      console.log("Task updated:", updatedTask);
      return updatedTask;
    } catch (e) {
      console.error(`Failed to update task ${taskId}:`, e);
      setError(e.message);
      throw e;
    } finally {
      // setIsLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    if (!user || !user.id) {
      throw new Error("Cannot delete task: user not available.");
    }
    // setIsLoading(true);
    try {
      await deleteTaskApi(taskId, user.id);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      console.log("Task deleted:", taskId);
    } catch (e) {
      console.error(`Failed to delete task ${taskId}:`, e);
      setError(e.message);
      throw e;
    } finally {
      // setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    if (!user || !user.id) {
        console.warn("Cannot toggle task status: user not available.");
        return;
    }
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.warn(`Cannot toggle task status: task ${taskId} not found.`);
        return;
    }

    const currentStatusValue = currentStatus?.toLowerCase();
    const newStatusValue = currentStatusValue === STATUS_OPTIONS_MAP.DONE
        ? STATUS_OPTIONS_MAP.NEW
        : STATUS_OPTIONS_MAP.DONE;

    const originalTasks = tasks.map(t => ({...t})); // Глубокое копирование для отката, если понадобится
    // Optimistically update UI
    setTasks(prevTasks =>
      prevTasks
        .map(t =>
          t.id === taskId ? { ...t, status: newStatusValue, updateDate: new Date().toISOString() } : t
        )
        // .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate)) // Сортировка
    );

    try {
      setError(null); // Clear previous errors before API call
      const updatedTaskPayload = { ...task, status: newStatusValue };
      const updatedTaskFromApi = await updateTaskStatusApi(taskId, updatedTaskPayload, user.id);
      // Обновляем задачу данными с сервера, чтобы иметь актуальную updateDate и другие возможные серверные изменения
      setTasks(prevTasks =>
        prevTasks
          .map(t => (t.id === taskId ? updatedTaskFromApi : t))
          .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate)) // Сортировка
      );
      console.log(`Task ${taskId} status toggled to ${newStatusValue}`);
    } catch (error) {
      setError(error.message); // Set error message on failure FIRST
      console.error(`Failed to toggle task ${taskId} status:`, error);
      setTasks(originalTasks.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))); // Откат и сортировка
    }
  };

  const value = {
    tasks,
    isLoadingTasks: isLoading,
    tasksError: error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    reloadTasks: () => user && user.id && loadTasks(user.id),
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
import AppLayout from './layouts/AppLayout';
import { UserProvider } from './contexts/UserContext';
import { TasksProvider } from './contexts/TasksContext';

export default function App() {
  return (
    <UserProvider>
      <TasksProvider>
        <AppLayout />
      </TasksProvider>
    </UserProvider>
  );
}
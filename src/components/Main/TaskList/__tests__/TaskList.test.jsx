import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import TaskList from '../TaskList';

// Define as a function declaration for hoisting
function InlinedSvgMock() { 
  return <div data-testid="mock-svg-icon"></div>; 
}

// --- Мокаем зависимости Task.jsx, используя пути от корня проекта (если Vitest их так поймет) ---
// Или оставляем относительные, если абсолютные не сработают.
// Начнем с относительных, но если что, изменим на абсолютные вида 'src/...' 

// Мокаем CSS импорт из Task.jsx
vi.mock('../Task/Task.css', () => ({ default: {} })); // Оставляем относительный, он должен быть корректен

// Мокаем константы
vi.mock('../../../../constants', async (importActual) => {
  const actual = await importActual();
  return { ...actual }; 
});

// Мокаем styled-components (это глобальный модуль, путь не относителен)
vi.mock('styled-components', async (importOriginal) => {
  const actualStyled = await importOriginal();
  return {
    ...actualStyled,
    default: vi.fn((tag) => {
      const MockedComponent = vi.fn((props) => {
        const { css, ...rest } = props;
        const className = props.className || '';
        return <tag {...rest} className={`${className} mock-styled`.trim()} data-testid={props['data-testid'] || 'mock-styled-component'} />;
      });
      return MockedComponent;
    }),
    css: vi.fn(() => ''), 
  };
});

// CheckButton
vi.mock('../../../CheckButton/CheckButton', () => ({
  default: vi.fn(() => <div data-testid="mock-check-button"></div>)
}));

// SVG mocks use the function declaration
vi.mock('../../../../assets/icons/TimeIcon19.svg', () => ({ ReactComponent: InlinedSvgMock }));
vi.mock('../../../../assets/icons/TimeImportantIcon19.svg', () => ({ ReactComponent: InlinedSvgMock }));
vi.mock('../../../../assets/icons/TasksDeadlineIcon.svg', () => ({ ReactComponent: InlinedSvgMock }));
vi.mock('../../../../assets/icons/TasksDurationIcon.svg', () => ({ ReactComponent: InlinedSvgMock }));
vi.mock('../../../../assets/icons/ActiveCheckIcon31.svg', () => ({ ReactComponent: InlinedSvgMock }));
vi.mock('../../../../assets/icons/InactiveCheckIcon31.svg', () => ({ ReactComponent: InlinedSvgMock }));
vi.mock('../../../../assets/icons/ActiveCheckImportantIcon31.svg', () => ({ ReactComponent: InlinedSvgMock }));
vi.mock('../../../../assets/icons/InactiveCheckImportantIcon31.svg', () => ({ ReactComponent: InlinedSvgMock }));
vi.mock('../../../../assets/icons/DeleteTaskIcon.svg', () => ({ ReactComponent: InlinedSvgMock }));

vi.mock('../../../../assets/img/defaultAvatar.png', () => ({ default: 'mock-default-avatar.png' }));
vi.mock('../../../../assets/img/userAvatar.png', () => ({ default: 'mock-user-avatar.png' }));
vi.mock('../../../../assets/img/bossAvatar.png', () => ({ default: 'mock-boss-avatar.png' }));
vi.mock('../../../../assets/img/sportAvatar.png', () => ({ default: 'mock-sport-avatar.png' }));
vi.mock('../../../../assets/img/selfDevelopmentAvatar.png', () => ({ default: 'mock-self-dev-avatar.png' }));
vi.mock('../../../../assets/img/studyAvatar.png', () => ({ default: 'mock-study-avatar.png' }));
vi.mock('../../../../assets/img/healthAvatar.png', () => ({ default: 'mock-health-avatar.png' }));
vi.mock('../../../../assets/img/workAvatar.png', () => ({ default: 'mock-work-avatar.png' }));
vi.mock('../../../../assets/img/leisureAvatar.png', () => ({ default: 'mock-leisure-avatar.png' }));
vi.mock('../../../../assets/img/householdAvatar.png', () => ({ default: 'mock-household-avatar.png' }));
vi.mock('../../../../assets/img/socialSphereAvatar.png', () => ({ default: 'mock-social-avatar.png' }));
// --- Конец моков зависимостей Task.jsx ---

// Мокаем сам Task.jsx с правильным относительным путем из TaskList.test.jsx
const MockTaskComponent = vi.fn(({ task, onDeleteTask, onToggleStatus, onTaskClick }) => (
  <div data-testid={`task-${task.id}`}>
    <span>{task.title}</span>
    <button data-testid={`delete-${task.id}`} onClick={() => onDeleteTask(task.id)}>Delete</button>
    <button data-testid={`toggle-${task.id}`} onClick={() => onToggleStatus(task.id, task.status)}>Toggle</button>
    <button data-testid={`click-${task.id}`} onClick={() => onTaskClick(task)}>Click</button>
  </div>
));

vi.mock('../Task/Task', () => ({
  __esModule: true,
  default: MockTaskComponent,
}));

const mockTasks = [
  { id: '1', title: 'Task 1', status: 'new', author: { id: 'user1' } },
  { id: '2', title: 'Task 2', status: 'done', author: { id: 'user2' } },
];

describe('TaskList Component', () => {
  let mockSetTasks;
  let mockOnOpenUpdateTaskModal;
  let mockOnOpenDeleteConfirmModal;
  let mockFetch;
  let mockConsoleError;
  let mockConsoleWarn;
  let mockConsoleLog; // Для подавления вывода в тестах

  beforeEach(() => {
    mockSetTasks = vi.fn();
    mockOnOpenUpdateTaskModal = vi.fn();
    mockOnOpenDeleteConfirmModal = vi.fn();
    mockFetch = vi.spyOn(global, 'fetch');
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.useFakeTimers(); // Для new Date() в вызове fetch
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders loading message when tasks are null', () => {
    render(<TaskList tasks={null} />);
    expect(screen.getByText('Загрузка задач...')).toBeInTheDocument();
  });

  it('renders loading message when tasks are undefined', () => {
    render(<TaskList tasks={undefined} />);
    expect(screen.getByText('Загрузка задач...')).toBeInTheDocument();
  });

  it('renders empty message when tasks array is empty', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText('Задач пока нет.')).toBeInTheDocument();
  });

  //  it('renders list of tasks', () => {
  //    render(<TaskList tasks={mockTasks} />);
  //    expect(screen.getByTestId('task-1')).toBeInTheDocument();
  //    expect(screen.getByText('Task 1')).toBeInTheDocument();
  //    expect(screen.getByTestId('task-2')).toBeInTheDocument();
  //    expect(screen.getByText('Task 2')).toBeInTheDocument();
  //  });

  //  it('calls onOpenDeleteConfirmModal when delete button on Task is clicked', () => {
  //    render(<TaskList tasks={mockTasks} onOpenDeleteConfirmModal={mockOnOpenDeleteConfirmModal} />);
  //    act(() => {
  //      screen.getByTestId('delete-1').click();
  //    });
  //    expect(mockOnOpenDeleteConfirmModal).toHaveBeenCalledWith('1');
  //  });
  //
  //  it('calls onOpenUpdateTaskModal when task item is clicked', () => {
  //    render(<TaskList tasks={mockTasks} onOpenUpdateTaskModal={mockOnOpenUpdateTaskModal} />);
  //    act(() => {
  //      screen.getByTestId('click-1').click();
  //    });
  //    expect(mockOnOpenUpdateTaskModal).toHaveBeenCalledWith(mockTasks[0]);
  //  });
  //
  //  describe('handleToggleStatus', () => {
  //    const initialTask = { id: '1', title: 'Task 1', status: 'new', author: { id: 'user1' } };
  //    const tasksArray = [initialTask];
  //    const mockDate = new Date(2024, 5, 15, 10, 0, 0); // 15 июня 2024, 10:00:00
  //    const isoDate = mockDate.toISOString();
  //
  //    beforeEach(() => {
  //      vi.setSystemTime(mockDate);
  //    });
  //
  //    it('successfully toggles status from new to done', async () => {
  //      mockFetch.mockResolvedValueOnce({
  //        ok: true,
  //        json: async () => ({ ...initialTask, status: 'done', updateDate: isoDate }),
  //      });
  //
  //      render(<TaskList tasks={tasksArray} setTasks={mockSetTasks} />);
  //      
  //      await act(async () => {
  //        screen.getByTestId('toggle-1').click();
  //      });
  //
  //      // Оптимистичное обновление
  //      expect(mockSetTasks).toHaveBeenCalledWith(expect.any(Function));
  //      const firstOptimisticUpdate = mockSetTasks.mock.calls[0][0];
  //      expect(firstOptimisticUpdate(tasksArray)).toEqual([{ ...initialTask, status: 'done' }]);
  //
  //      // Вызов fetch
  //      expect(mockFetch).toHaveBeenCalledWith(
  //        `http://localhost:15614/tasks/1?userID=user1`,
  //        expect.objectContaining({
  //          method: 'PUT',
  //          headers: { 'Content-Type': 'application/json' },
  //          body: JSON.stringify({ ...initialTask, status: 'done', updateDate: isoDate }),
  //        })
  //      );
  //
  //      // Финальное обновление с данными сервера
  //      expect(mockSetTasks).toHaveBeenCalledTimes(2);
  //      const secondUpdate = mockSetTasks.mock.calls[1][0];
  //      expect(secondUpdate(tasksArray)).toEqual([{ ...initialTask, status: 'done', updateDate: isoDate }]);
  //    });
  //
  //    it('successfully toggles status from done to new', async () => {
  //      const doneTask = { ...initialTask, status: 'done' };
  //      const tasksDoneArray = [doneTask];
  //      mockFetch.mockResolvedValueOnce({
  //        ok: true,
  //        json: async () => ({ ...doneTask, status: 'new', updateDate: isoDate }),
  //      });
  //
  //      render(<TaskList tasks={tasksDoneArray} setTasks={mockSetTasks} />);
  //      await act(async () => {
  //        screen.getByTestId('toggle-1').click();
  //      });
  //
  //      expect(mockSetTasks.mock.calls[0][0](tasksDoneArray)).toEqual([{ ...doneTask, status: 'new' }]);
  //      expect(mockFetch).toHaveBeenCalledWith(
  //        `http://localhost:15614/tasks/1?userID=user1`,
  //        expect.objectContaining({
  //          body: JSON.stringify({ ...doneTask, status: 'new', updateDate: isoDate }),
  //        })
  //      );
  //      expect(mockSetTasks.mock.calls[1][0](tasksDoneArray)).toEqual([{ ...doneTask, status: 'new', updateDate: isoDate }]);
  //    });
  //
  //    it('handles API error and reverts status', async () => {
  //      mockFetch.mockResolvedValueOnce({
  //        ok: false,
  //        status: 500,
  //        text: async () => 'Internal Server Error',
  //      });
  //
  //      render(<TaskList tasks={tasksArray} setTasks={mockSetTasks} />);
  //      await act(async () => {
  //        screen.getByTestId('toggle-1').click();
  //      });
  //
  //      // Оптимистичное обновление
  //      expect(mockSetTasks.mock.calls[0][0](tasksArray)).toEqual([{ ...initialTask, status: 'done' }]);
  //      
  //      // Fetch был вызван
  //      expect(mockFetch).toHaveBeenCalledTimes(1);
  //
  //      // Откат статуса
  //      expect(mockSetTasks).toHaveBeenCalledTimes(2);
  //      const revertUpdate = mockSetTasks.mock.calls[1][0];
  //      expect(revertUpdate([{ ...initialTask, status: 'done' }])).toEqual([{ ...initialTask, status: 'new' }]); // Откат к 'new'
  //
  //      expect(mockConsoleError).toHaveBeenCalledWith(
  //        "Error updating task status on API:",
  //        new Error('Failed to update task status on API: 500 Internal Server Error')
  //      );
  //    });
  //
  //    it('warns and does not call fetch if author ID is missing', async () => {
  //      const taskWithoutAuthor = { ...initialTask, author: null };
  //      const tasksNoAuthorArray = [taskWithoutAuthor];
  //
  //      render(<TaskList tasks={tasksNoAuthorArray} setTasks={mockSetTasks} />);
  //      await act(async () => {
  //        screen.getByTestId('toggle-1').click();
  //      });
  //
  //      // Оптимистичное обновление все еще происходит
  //      expect(mockSetTasks).toHaveBeenCalledTimes(1);
  //      expect(mockSetTasks.mock.calls[0][0](tasksNoAuthorArray)).toEqual([{ ...taskWithoutAuthor, status: 'done' }]);
  //      
  //      expect(mockFetch).not.toHaveBeenCalled();
  //      expect(mockConsoleWarn).toHaveBeenCalledWith(
  //        "Cannot update status: task or author ID not found for task", '1'
  //      );
  //    });
  //
  //    it('warns and does not call fetch if task is not found (edge case, task disappears mid-process)', async () => {
  //      // Этот тест немного искусственный, так как handleToggleStatus вызывается из Task, который должен существовать
  //      // Но для проверки внутренней логики handleToggleStatus, если tasks вдруг изменятся
  //      const emptyTasksArray = []; // Задачи нет в массиве, который используется для поиска taskToUpdate
  //      
  //      render(<TaskList tasks={tasksArray} setTasks={mockSetTasks} />); // Рендерим с задачами
  //       // Меняем `tasks` проп на пустой массив перед тем как `handleToggleStatus` найдет задачу
  //      // Для этого нам нужно перехватить вызов find и изменить tasks
  //      const originalFind = Array.prototype.find;
  //      let findCalled = false;
  //      Array.prototype.find = function(...args) {
  //        if (!findCalled && this === tasksArray) { // Перехватываем первый find для tasksArray
  //            findCalled = true;
  //            // Эмулируем, что задача исчезла из `tasks`, используемых внутри handleToggleStatus
  //            // Это можно сделать, если бы `tasks` были глобальной переменной или частью замыкания, что тут не так.
  //            // Вместо этого, проще передать пустой tasks массив в render
  //            // Либо просто проверить случай, когда taskToUpdate.author.id не найден (как в тесте выше)
  //        }
  //        return originalFind.apply(this, args);
  //      }; 
  //
  //      // Лучше протестировать вариант, когда `tasks.find(...)` не находит задачу, 
  //      // хотя она была в `prevTasks` для оптимистичного обновления.
  //      // Это будет, если `tasks` проп изменится между оптимистичным `setTasks` и поиском `taskToUpdate`.
  //      // Более простой вариант - передать задачу без author.id, что уже покрыто.
  //
  //      // Давайте просто вызовем handleToggleStatus напрямую с ID, которого нет в `tasks`
  //      // Это не совсем то, как компонент работает, но тестирует часть логики
  //      const instance = new TaskList({ tasks: [], setTasks: mockSetTasks }); // Пустой массив задач
  //      await act(async () => {
  //        instance.props.onToggleStatus('non-existent-id', 'new'); // Вызываем обработчик напрямую
  //      });
  //      // Так как TaskList - это функциональный компонент, мы не можем так просто создать экземпляр и вызвать.
  //      // Вернемся к предыдущему тесту с taskWithoutAuthor, он покрывает сценарий когда userID не может быть получен.
  //
  //      // Сценарий, когда `task.author` есть, но `task.author.id` нет:
  //      const taskWithNullAuthorId = { ...initialTask, author: { id: null } };
  //      const tasksNullAuthorIdArray = [taskWithNullAuthorId];
  //      render(<TaskList tasks={tasksNullAuthorIdArray} setTasks={mockSetTasks} />);
  //      await act(async () => {
  //        screen.getByTestId('toggle-1').click();
  //      });
  //      expect(mockFetch).not.toHaveBeenCalled();
  //      expect(mockConsoleWarn).toHaveBeenCalledWith(
  //        "Cannot update status: task or author ID not found for task", '1'
  //      );
  //      Array.prototype.find = originalFind; // Восстанавливаем
  //    });
  //
  //    it('still calls fetch if setTasks is not provided (and task/author is valid)', async () => {
  //      mockFetch.mockResolvedValueOnce({
  //        ok: true,
  //        json: async () => ({ ...initialTask, status: 'done', updateDate: isoDate }),
  //      });
  //
  //      render(<TaskList tasks={tasksArray} setTasks={null} />); // setTasks = null
  //      await act(async () => {
  //        screen.getByTestId('toggle-1').click();
  //      });
  //
  //      expect(mockSetTasks).not.toHaveBeenCalled(); // setTasks не должен быть вызван
  //      expect(mockFetch).toHaveBeenCalledTimes(1);
  //      // Проверим, что console.log вызывается об успешном обновлении на API
  //      expect(mockConsoleLog).toHaveBeenCalledWith("Task status updated on API:", { ...initialTask, status: 'done', updateDate: isoDate });
  //    });
  //  });

}); 
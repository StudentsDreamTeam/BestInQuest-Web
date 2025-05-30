import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Task from '../Task'; // Путь к тестируемому компоненту
// Предполагаем, что IMPORTANT_PRIORITIES должно быть IMPORTANT_PRIORITIES_VALUES
import { IMPORTANT_PRIORITIES_VALUES, STATUS_OPTIONS_MAP, PRIORITY_OPTIONS_MAP } from '../../../../constants'; 

// const ASSET_PATH_PREFIX = '../../../../../src'; // Убрано

// Мокаем константы, если они используются внутри компонента и мы хотим их контролировать
// или если есть ошибка в их импорте в компоненте
vi.mock('../../../../constants', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual, // Возвращаем все реальные экспорты, IMPORTANT_PRIORITIES_VALUES будет реальным
    // Если бы IMPORTANT_PRIORITIES действительно существовала и отличалась, мокнули бы ее тут
    // IMPORTANT_PRIORITIES: actual.IMPORTANT_PRIORITIES_VALUES, // Пример, если бы имя было другое
    // IMPORTANT_PRIORITIES: actual.IMPORTANT_PRIORITIES_VALUES // Это больше не нужно
  };
});

// Моки с захардкоженными путями
vi.mock('../../../../../src/assets/icons/ActiveCheckIcon31.svg', () => ({ ReactComponent: () => <div data-testid="active-check-icon" /> }));
vi.mock('../../../../../src/assets/icons/ActiveCheckImportantIcon31.svg', () => ({ ReactComponent: () => <div data-testid="active-check-important-icon" /> }));
vi.mock('../../../../../src/assets/icons/PassiveCheckIcon31.svg', () => ({ ReactComponent: () => <div data-testid="passive-check-icon" /> }));
vi.mock('../../../../../src/assets/icons/PassiveCheckImportantIcon31.svg', () => ({ ReactComponent: () => <div data-testid="passive-check-important-icon" /> }));
vi.mock('../../../../../src/assets/icons/TrashIcon34.svg', () => ({ ReactComponent: () => <div data-testid="trash-icon" /> }));
vi.mock('../../../../../src/assets/icons/TrashImportantIcon34.svg', () => ({ ReactComponent: () => <div data-testid="trash-important-icon" /> }));
vi.mock('../../../../../src/assets/icons/TimeIcon19.svg', () => ({ ReactComponent: () => <div data-testid="time-icon" /> }));
vi.mock('../../../../../src/assets/icons/TimeImportantIcon19.svg', () => ({ ReactComponent: () => <div data-testid="time-important-icon" /> }));

vi.mock('../../../../../src/assets/img/userAvatar.png', () => ({ default: 'defaultUserAvatar.png' }));
vi.mock('../../../../../src/assets/img/bossAvatar.png', () => ({ default: 'defaultBossAvatar.png' }));
vi.mock('../../../../../src/assets/img/sportAvatar.png', () => ({ default: 'sportAvatar.png' }));
vi.mock('../../../../../src/assets/img/workAvatar.png', () => ({ default: 'workAvatar.png' }));
vi.mock('../../../../../src/assets/img/selfDevelopmentAvatar.png', () => ({ default: 'selfDevelopmentAvatar.png' }));

// Мокаем Date.prototype.toLocaleString
let originalLocaleString;

describe('Main Task Component (src/components/Main/Task/Task.jsx)', () => {
  let mockOnDeleteTask;
  let mockOnToggleStatus;
  let mockOnTaskClick;

  const baseTask = {
    id: 'task-main-1',
    title: 'Main Test Task Title',
    status: 'new', // или любой другой не 'DONE'
    priority: PRIORITY_OPTIONS_MAP.NORMAL, // или любой другой не важный
    deadline: '2024-12-31T15:00:00Z',
    duration: 1800, // 30 минут
    author: { name: 'Test Author' }, // Аватар не используется напрямую из task.author.avatar
    executor: { name: 'Test Executor' }, // Аватар не используется напрямую из task.executor.avatar
    sphere: 'work',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockOnDeleteTask = vi.fn();
    mockOnToggleStatus = vi.fn();
    mockOnTaskClick = vi.fn();

    originalLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = vi.fn(function(locale, options) {
      // `this` здесь - это объект Date, для которого вызван toLocaleString
      // console.log('[MOCK toLocaleString] Called with this:', this, 'valueOf:', this.valueOf(), 'isNaN:', isNaN(this.valueOf()));
      // console.log('[MOCK toLocaleString] Args:', locale, options);

      try {
        const dateValue = this.toISOString();
        // console.log('[MOCK toLocaleString] this.toISOString():', dateValue);
        if (dateValue === '2024-12-31T15:00:00.000Z') {
          // console.log('[MOCK toLocaleString] Matched 2024-12-31');
          return '31 дек, 15:00';
        }
        if (dateValue === '2025-01-05T08:30:00.000Z') {
          // console.log('[MOCK toLocaleString] Matched 2025-01-05');
          return '5 янв, 08:30';
        }
      } catch (e) {
        // console.error('[MOCK toLocaleString] Error calling toISOString:', e);
      }

      if (isNaN(this.valueOf())) {
        // console.log('[MOCK toLocaleString] Matched isNaN, returning Invalid Date');
        return 'Invalid Date';
      }
      
      // console.log('[MOCK toLocaleString] No match, calling original');
      return originalLocaleString.call(this, locale, options); 
    });
  });

  afterEach(() => {
    Date.prototype.toLocaleString = originalLocaleString;
  });

  // --- Тесты на рендеринг --- 
  it('renders basic task information', () => {
    render(
      <Task 
        task={baseTask} 
        onDeleteTask={mockOnDeleteTask} 
        onToggleStatus={mockOnToggleStatus} 
        onTaskClick={mockOnTaskClick} 
      />
    );
    expect(screen.getByText(baseTask.title)).toBeInTheDocument();
    // Ожидаем вывод нашего мока toLocaleString
    expect(screen.getByText("31 дек, 15:00")).toBeInTheDocument(); 
    // formatDurationTime: 30 мин
    expect(screen.getByText('30 мин')).toBeInTheDocument(); 

    expect(screen.getByText(baseTask.author.name)).toBeInTheDocument();
    expect(screen.getByText(baseTask.executor.name)).toBeInTheDocument();
    expect(screen.getByText(baseTask.sphere)).toBeInTheDocument();

    expect(screen.getByTestId('passive-check-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('time-icon')).toHaveLength(2);
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    expect(images.find(img => img.alt === 'author').src).toContain('defaultBossAvatar.png');
    expect(images.find(img => img.alt === 'executor').src).toContain('defaultUserAvatar.png');
    expect(images.find(img => img.alt === baseTask.sphere).src).toContain('workAvatar.png');
  });

  it('renders an important task with correct styles and icons', () => {
    const importantTask = { ...baseTask, priority: PRIORITY_OPTIONS_MAP.HIGH }; 
    render(<Task task={importantTask} />);
    expect(screen.getByTestId('passive-check-important-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('time-important-icon')).toHaveLength(2);
    expect(screen.getByTestId('trash-important-icon')).toBeInTheDocument();
  });

  it('renders a completed task with correct check icon', () => {
    const completedTask = { ...baseTask, status: 'DONE' }; // Статус в верхнем регистре, как в компоненте
    render(<Task task={completedTask} />);
    expect(screen.getByTestId('active-check-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('time-icon')).toHaveLength(2);
  });

  it('renders an important and completed task with correct icons', () => {
    const importantCompletedTask = {
      ...baseTask,
      priority: PRIORITY_OPTIONS_MAP.HIGH, 
      status: 'DONE',
    };
    render(<Task task={importantCompletedTask} />);
    expect(screen.getByTestId('active-check-important-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('time-important-icon')).toHaveLength(2);
    expect(screen.getByTestId('trash-important-icon')).toBeInTheDocument();
  });

  describe('Event Handlers', () => {
    it('calls onToggleStatus when CheckButton is clicked', () => {
      render(<Task task={baseTask} onToggleStatus={mockOnToggleStatus} />);      
      const checkButton = screen.getByTestId('passive-check-icon').closest('button');
      fireEvent.click(checkButton);
      expect(mockOnToggleStatus).toHaveBeenCalledWith(baseTask.id, baseTask.status);
    });

    it('calls onDeleteTask when DeleteContainer (trash icon area) is clicked', () => {
      render(<Task task={baseTask} onDeleteTask={mockOnDeleteTask} />);      
      const deleteContainer = screen.getByTestId('trash-icon').closest('.delete-container');
      fireEvent.click(deleteContainer);
      expect(mockOnDeleteTask).toHaveBeenCalledWith(baseTask.id);
    });

    it('does not call onDeleteTask if not provided', () => {
      render(<Task task={baseTask} onDeleteTask={null} />);      
      const deleteContainer = screen.getByTestId('trash-icon').closest('.delete-container');
      expect(() => fireEvent.click(deleteContainer)).not.toThrow();
      expect(mockOnDeleteTask).not.toHaveBeenCalled();
    });
    
    it('calls onTaskClick when TaskInfo is clicked', () => {
      render(<Task task={baseTask} onTaskClick={mockOnTaskClick} />);      
      fireEvent.click(screen.getByTestId('task-info-main'));
      expect(mockOnTaskClick).toHaveBeenCalledWith(baseTask);
    });

    it('does not call onTaskClick if not provided', () => {
        render(<Task task={baseTask} onTaskClick={null} />);      
        const taskInfo = screen.getByTestId('task-info-main');
        expect(() => fireEvent.click(taskInfo)).not.toThrow();
        expect(mockOnTaskClick).not.toHaveBeenCalled();
      });
  });

  describe('Data Rendering, Defaults and Formatting', () => {
    it('renders default texts for missing optional data and specific formats', () => {
      const taskWithMissingData = { id: 'task-main-2' }; // Нет title, deadline, duration, sphere, author, executor
      render(<Task task={taskWithMissingData} />); 
      expect(screen.getByText('Без названия')).toBeInTheDocument();
      expect(screen.getByText('Нет дедлайна')).toBeInTheDocument(); // formatDateTime(undefined)
      expect(screen.getByText('0 сек')).toBeInTheDocument(); // formatDurationTime(undefined -> 0)
      expect(screen.getByText('Неизвестный автор')).toBeInTheDocument();
      expect(screen.getByText('Не назначен')).toBeInTheDocument();
      expect(screen.getByText('Не указана')).toBeInTheDocument();
      const images = screen.getAllByRole('img');
      expect(images.find(img => img.alt === 'author').src).toContain('defaultBossAvatar.png');
      expect(images.find(img => img.alt === 'executor').src).toContain('defaultUserAvatar.png');
      expect(images.find(img => img.alt === 'сфера').src).toContain('sportAvatar.png');
      expect(screen.getAllByTestId('time-icon')).toHaveLength(2);
    });

    it.each([
      { sphere: 'sport', expectedAvatar: 'sportAvatar.png' },
      { sphere: 'work', expectedAvatar: 'workAvatar.png' },
      { sphere: 'self-development', expectedAvatar: 'selfDevelopmentAvatar.png' },
      { sphere: 'UNKNOWN', expectedAvatar: 'sportAvatar.png' }, // Default
    ])('renders correct avatar for sphere "$sphere"', ({ sphere, expectedAvatar }) => {
      render(<Task task={{ ...baseTask, sphere }} />);
      const sphereImage = screen.getAllByRole('img').find(img => img.alt === (sphere || 'сфера'));
      expect(sphereImage.src).toContain(expectedAvatar);
    });

    // Тесты для formatDateTime
    it('formats deadline correctly', () => {
      render(<Task task={{ ...baseTask, deadline: '2025-01-05T08:30:00Z' }} />);
      expect(screen.getByText("5 янв, 08:30")).toBeInTheDocument();
    });
    it('handles invalid deadline string in formatDateTime gracefully', () => {
      render(<Task task={{ ...baseTask, deadline: 'invalid-date' }} />);
      expect(screen.getByText('Invalid Date')).toBeInTheDocument(); 
    });

    // Тесты для formatDurationTime
    it.each([
      { duration: 50, expected: '50 сек' },
      { duration: 60, expected: '1 мин' },    // Было: 60 сек. Исправлено в логике компонента на 1 мин.
      { duration: 125, expected: '2 мин' },   // Было: 125 сек. Исправлено на 2 мин.
      { duration: 3600, expected: '1 ч' },
      { duration: 3665, expected: '1 ч 1 мин' }, // Было: 3660 сек. Исправлено на 1ч 1мин (3665 сек)
      { duration: 7200, expected: '2 ч' },
      { duration: 0, expected: '0 сек' },
    ])('formats duration $duration seconds as $expected', ({ duration, expected }) => {
      render(<Task task={{ ...baseTask, duration }} />);
      // Ищем по title родительского TaskDataObject, чтобы изолировать нужный span
      const durationObject = screen.getByTitle(`Продолжительность: ${expected}`);
      // Затем ищем span внутри этого объекта
      const spanElement = durationObject.querySelector('span');
      expect(spanElement).toHaveTextContent(expected);
    });
  });
}); 
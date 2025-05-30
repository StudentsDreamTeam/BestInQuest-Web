import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Task from '../Task';
import { useTasks } from '../../../../contexts/TasksContext';
import { IMPORTANT_PRIORITIES_VALUES, STATUS_OPTIONS_MAP } from '../../../../constants';
import { formatTaskCardDateTime, formatTaskCardDuration } from '../../../../utils/dateTimeUtils';

// Мокаем useTasks
vi.mock('../../../../contexts/TasksContext', () => ({
  useTasks: vi.fn(),
}));

// Мокаем утилиты форматирования, чтобы они возвращали предсказуемые значения
vi.mock('../../../../utils/dateTimeUtils', () => ({
  formatTaskCardDateTime: vi.fn((date) => `formatted_date_${date}`),
  formatTaskCardDuration: vi.fn((duration) => `formatted_duration_${duration}`),
}));

// Явно мокаем constants, чтобы вернуть актуальные значения
vi.mock('../../../../constants', async (importActual) => {
  const actual = await importActual();
  return { ...actual };
});

// Мокаем иконки как простые компоненты
vi.mock('../../../../assets/icons/ActiveCheckIcon31.svg', () => ({ ReactComponent: () => <div data-testid="active-check-icon" /> }));
vi.mock('../../../../assets/icons/ActiveCheckImportantIcon31.svg', () => ({ ReactComponent: () => <div data-testid="active-check-important-icon" /> }));
vi.mock('../../../../assets/icons/PassiveCheckIcon31.svg', () => ({ ReactComponent: () => <div data-testid="passive-check-icon" /> }));
vi.mock('../../../../assets/icons/PassiveCheckImportantIcon31.svg', () => ({ ReactComponent: () => <div data-testid="passive-check-important-icon" /> })); 
vi.mock('../../../../assets/icons/TrashIcon34.svg', () => ({ ReactComponent: () => <div data-testid="trash-icon" /> }));
vi.mock('../../../../assets/icons/TrashImportantIcon34.svg', () => ({ ReactComponent: () => <div data-testid="trash-important-icon" /> }));
vi.mock('../../../../assets/icons/TimeIcon19.svg', () => ({ ReactComponent: () => <div data-testid="time-icon" /> }));
vi.mock('../../../../assets/icons/TimeImportantIcon19.svg', () => ({ ReactComponent: () => <div data-testid="time-important-icon" /> }));

// Мокаем аватары (пути к изображениям) (ИСПРАВЛЕНО ДЛЯ DEFAULT EXPORT)
vi.mock('../../../../assets/img/userAvatar.png', () => ({ default: 'defaultUserAvatar.png' }));
vi.mock('../../../../assets/img/bossAvatar.png', () => ({ default: 'defaultBossAvatar.png' }));
vi.mock('../../../../assets/img/sportAvatar.png', () => ({ default: 'sportAvatar.png' }));
vi.mock('../../../../assets/img/workAvatar.png', () => ({ default: 'workAvatar.png' }));
vi.mock('../../../../assets/img/selfDevelopmentAvatar.png', () => ({ default: 'selfDevelopmentAvatar.png' }));


describe('Task Component', () => {
  let mockToggleTaskStatus;
  let mockOnOpenUpdateModal;
  let mockOnOpenDeleteConfirmModal;

  const baseTask = {
    id: '1',
    title: 'Test Task Title',
    status: 'new',
    priority: 'medium',
    deadline: '2024-01-01T12:00:00Z',
    duration: 3600,
    author: { id: 'author1', name: 'Author Name', avatar: 'author.png' },
    executor: { id: 'executor1', name: 'Executor Name', avatar: 'executor.png' },
    sphere: 'work',
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Это должно сбрасывать и моки, сделанные через vi.mock с фабрикой

    mockToggleTaskStatus = vi.fn();
    mockOnOpenUpdateModal = vi.fn();
    mockOnOpenDeleteConfirmModal = vi.fn();

    // Так как useTasks и dateTimeUtils мокаются с vi.fn(), 
    // их нужно переназначать или их реализации в каждом beforeEach, 
    // если clearAllMocks их сбрасывает до простого vi.fn() без реализации.
    useTasks.mockReturnValue({ toggleTaskStatus: mockToggleTaskStatus });
    formatTaskCardDateTime.mockImplementation((date) => `formatted_date_${date}`);
    formatTaskCardDuration.mockImplementation((duration) => `formatted_duration_${duration}`);
  });

  it('renders basic task information for a non-important, non-completed task', () => {
    render(<Task task={baseTask} onOpenUpdateModal={mockOnOpenUpdateModal} onOpenDeleteConfirmModal={mockOnOpenDeleteConfirmModal} />);

    expect(screen.getByText(baseTask.title)).toBeInTheDocument();
    expect(screen.getByText(`formatted_date_${baseTask.deadline}`)).toBeInTheDocument();
    expect(screen.getByText(`formatted_duration_${baseTask.duration}`)).toBeInTheDocument();
    expect(screen.getByText(baseTask.author.name)).toBeInTheDocument();
    expect(screen.getByText(baseTask.executor.name)).toBeInTheDocument();
    expect(screen.getByText(baseTask.sphere)).toBeInTheDocument();

    const taskContainer = screen.getByTestId('task-container');

    expect(screen.getByTestId('passive-check-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('time-icon')).toHaveLength(2);
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    expect(images.find(img => img.alt === 'author').src).toContain('author.png');
    expect(images.find(img => img.alt === 'executor').src).toContain('executor.png');
    expect(images.find(img => img.alt === baseTask.sphere).src).toContain('workAvatar.png');
  });

  it('renders an important task with correct styles and icons', () => {
    const importantTask = { ...baseTask, priority: IMPORTANT_PRIORITIES_VALUES[0] };
    render(<Task task={importantTask} />);

    expect(screen.getByTestId('passive-check-important-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('time-important-icon')).toHaveLength(2);
    expect(screen.getByTestId('trash-important-icon')).toBeInTheDocument();
  });

  it('renders a completed task with correct check icon', () => {
    const completedTask = { ...baseTask, status: STATUS_OPTIONS_MAP.DONE };
    render(<Task task={completedTask} />);

    expect(screen.getByTestId('active-check-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('time-icon')).toHaveLength(2);
  });

  it('renders an important and completed task with correct icons', () => {
    const importantCompletedTask = {
      ...baseTask,
      priority: IMPORTANT_PRIORITIES_VALUES[0],
      status: STATUS_OPTIONS_MAP.DONE,
    };
    render(<Task task={importantCompletedTask} />);

    expect(screen.getByTestId('active-check-important-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('time-important-icon')).toHaveLength(2);
    expect(screen.getByTestId('trash-important-icon')).toBeInTheDocument();
  });

  describe('Event Handlers', () => {
    it('calls toggleTaskStatus when CheckButton is clicked', () => {
      render(<Task task={baseTask} />);
      const checkButton = screen.getByTestId('passive-check-icon').closest('button');
      fireEvent.click(checkButton);
      expect(mockToggleTaskStatus).toHaveBeenCalledWith(baseTask.id, baseTask.status);
    });

    it('calls onOpenDeleteConfirmModal when DeleteContainer is clicked', () => {
      render(<Task task={baseTask} onOpenDeleteConfirmModal={mockOnOpenDeleteConfirmModal} />);
      const deleteIcon = screen.getByTestId('trash-icon');
      fireEvent.click(deleteIcon.parentElement);
      expect(mockOnOpenDeleteConfirmModal).toHaveBeenCalledWith(baseTask.id);
    });

    it('does not throw if onOpenDeleteConfirmModal is not provided and delete is clicked', () => {
      render(<Task task={baseTask} onOpenDeleteConfirmModal={null} />);
      const deleteIcon = screen.getByTestId('trash-icon');
      expect(() => fireEvent.click(deleteIcon.parentElement)).not.toThrow();
      expect(mockOnOpenDeleteConfirmModal).not.toHaveBeenCalled();
    });

    it('calls onOpenUpdateModal when TaskInfo is clicked', () => {
      render(<Task task={baseTask} onOpenUpdateModal={mockOnOpenUpdateModal} />);
      fireEvent.click(screen.getByTestId('task-info'));
      expect(mockOnOpenUpdateModal).toHaveBeenCalledWith(baseTask);
    });

    it('does not throw if onOpenUpdateModal is not provided and TaskInfo is clicked', () => {
      render(<Task task={baseTask} onOpenUpdateModal={null} />);
      const taskInfoDiv = screen.getByTestId('task-info');
      expect(() => fireEvent.click(taskInfoDiv)).not.toThrow();
      expect(mockOnOpenUpdateModal).not.toHaveBeenCalled();
    });
  });

  describe('Data Rendering and Defaults', () => {
    it('renders default texts for missing optional data', () => {
      const taskWithMissingData = {
        id: '2',
        // title is missing
        // deadline is missing
        // duration is missing
        // sphere is missing
        // author is missing
        // executor is missing
      };
      render(<Task task={taskWithMissingData} />);

      expect(screen.getByText('Без названия')).toBeInTheDocument();
      expect(screen.getByText(`formatted_date_undefined`)).toBeInTheDocument(); // formatTaskCardDateTime(undefined)
      expect(screen.getByText(`formatted_duration_undefined`)).toBeInTheDocument(); // formatTaskCardDuration(undefined)
      expect(screen.getByText('Неизвестный автор')).toBeInTheDocument();
      expect(screen.getByText('Не назначен')).toBeInTheDocument();
      expect(screen.getByText('Не указана')).toBeInTheDocument();
      
      // Check default avatars
      const images = screen.getAllByRole('img');
      expect(images.find(img => img.alt === 'author').src).toContain('defaultBossAvatar.png');
      expect(images.find(img => img.alt === 'executor').src).toContain('defaultUserAvatar.png');
      // default sphere avatar is sportAvatar based on getSphereAvatar logic
      expect(images.find(img => img.alt === 'сфера').src).toContain('sportAvatar.png'); 
      expect(screen.getAllByTestId('time-icon')).toHaveLength(2);
    });

    it.each([
      { sphere: 'sport', expectedAvatar: 'sportAvatar.png' },
      { sphere: 'work', expectedAvatar: 'workAvatar.png' },
      { sphere: 'self-development', expectedAvatar: 'selfDevelopmentAvatar.png' },
      { sphere: 'sPoRt', expectedAvatar: 'sportAvatar.png' }, // Case-insensitivity
      { sphere: 'unknownSphere', expectedAvatar: 'sportAvatar.png' }, // Default
      { sphere: null, expectedAvatar: 'sportAvatar.png' }, // Default for null
      { sphere: undefined, expectedAvatar: 'sportAvatar.png' }, // Default for undefined
    ])('renders correct avatar for sphere "$sphere" ($expectedAvatar)', ({ sphere, expectedAvatar }) => {
      const taskWithSphere = { ...baseTask, sphere };
      render(<Task task={taskWithSphere} />);
      const sphereImage = screen.getAllByRole('img').find(img => img.alt === (sphere || 'сфера'));
      expect(sphereImage.src).toContain(expectedAvatar);
    });
  });
}); 
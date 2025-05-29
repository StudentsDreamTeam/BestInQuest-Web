import { vi, expect } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import { styleSheetSerializer } from 'jest-styled-components/serializer'

// Добавляем глобальный React
global.React = React

// Add the serializer for styled-components
expect.addSnapshotSerializer(styleSheetSerializer)

// Создаем базовый компонент для SVG
const createSvgComponent = (name) => {
  const SvgComponent = React.forwardRef((props, ref) => {
    return React.createElement('svg', {
      ...props,
      ref,
      'data-testid': name,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    });
  });
  SvgComponent.displayName = name;
  return SvgComponent;
};

// Моки для SVG компонентов
vi.mock('@/assets/icons/XPIcon52x28.svg', () => ({
  ReactComponent: createSvgComponent('xp-icon')
}), { virtual: true });

vi.mock('@/assets/icons/StarIcon41x37.svg', () => ({
  ReactComponent: createSvgComponent('star-icon')
}), { virtual: true });

vi.mock('@/assets/icons/TrashIcon34.svg', () => ({
  ReactComponent: createSvgComponent('trash-icon')
}), { virtual: true });

vi.mock('@/assets/icons/CheckIcon52.svg', () => ({
  ReactComponent: createSvgComponent('check-icon')
}), { virtual: true });

// Мок для dateTimeUtils
vi.mock('@/utils/dateTimeUtils', () => ({
  formatDeadlineForDisplay: vi.fn().mockReturnValue('01.01.2024'),
  formatDateTimeForInput: vi.fn().mockReturnValue('2024-01-01T00:00'),
  secondsToHHMM: vi.fn().mockReturnValue('01:00'),
  hhMMToSeconds: vi.fn().mockReturnValue(3600),
  formatDurationForDisplay: vi.fn().mockReturnValue('1 час'),
  formatFullDateTime: vi.fn().mockReturnValue('01.01.2024 00:00')
}));

// Мок для констант
vi.mock('@/constants', () => ({
  DIFFICULTY_VALUES: [1, 2, 3, 4, 5],
  DIFFICULTY_LABELS: {
    1: 'Очень легко',
    2: 'Легко',
    3: 'Нормально',
    4: 'Сложно',
    5: 'Очень сложно'
  },
  SPHERE_OPTIONS: ['WORK', 'SPORT', 'SELF_DEVELOPMENT'],
  SPHERE_LABELS: {
    WORK: 'Работа',
    SPORT: 'Спорт',
    SELF_DEVELOPMENT: 'Саморазвитие'
  },
  PRIORITY_OPTIONS_KEYS: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
  PRIORITY_SLIDER_LABELS: {
    0: 'Низкая',
    1: 'Обычная',
    2: 'Высокая',
    3: 'Срочная'
  },
  PRIORITY_OPTIONS_MAP: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
  },
  STATUS_OPTIONS_MAP: {
    NEW: "new",
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    WAITING_REVIEW: "waiting_review",
    DONE: "done"
  }
}));

// Добавляем моки для window.alert и console.error
window.alert = vi.fn();
console.error = vi.fn(); 
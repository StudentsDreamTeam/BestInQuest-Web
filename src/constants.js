export const API_BASE_URL = 'http://localhost:15614';

export const STATUS_OPTIONS_MAP = {
  NEW: "new",
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  WAITING_REVIEW: "waiting_review",
  DONE: "done"
};
// Массив ключей для удобства, если нужен порядок или итерация по ключам
export const STATUS_OPTIONS_KEYS = Object.keys(STATUS_OPTIONS_MAP); // ["NEW", "PENDING", ...]

// Единственный атрибут, который какого-то фига в API передается циферками...мдам...
export const DIFFICULTY_OPTIONS = ["EASY", "SIMPLE", "NORMAL", "HARD", "IMPOSSIBLE"]; // Используется для UI, если нужно
export const DIFFICULTY_VALUES = [0, 1, 2, 3, 4]; // Значения для API и слайдера
export const DIFFICULTY_LABELS = {
  0: "Очень легко",
  1: "Легко",
  2: "Средне",
  3: "Сложно",
  4: "Очень сложно",
};

export const PRIORITY_OPTIONS_MAP = {
  OPTIONAL: "optional",
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  CRITICAL: "critical"
};
// Массив ключей для удобства, если нужен порядок или итерация по ключам (для слайдера)
export const PRIORITY_OPTIONS_KEYS = Object.keys(PRIORITY_OPTIONS_MAP); // ["OPTIONAL", "LOW", ...]

export const IMPORTANT_PRIORITIES_VALUES = [
    PRIORITY_OPTIONS_MAP.HIGH,
    PRIORITY_OPTIONS_MAP.CRITICAL
]; // Используется для определения "важности" для стилизации задачи (фиолетовый цвет)

export const PRIORITY_SLIDER_LABELS = {
  0: "Опционально", // OPTIONAL
  1: "Низкая",      // LOW
  2: "Обычная",     // NORMAL
  3: "Высокая",     // HIGH
  4: "Критическая"  // CRITICAL
};

export const SPHERE_OPTIONS = ["Sport", "Study", "Household", "Work", "Self-Development"];
export const SPHERE_LABELS = {
  "Sport": "Спорт",
  "Study": "Учеба",
  "Household": "Быт",
  "Work": "Работа",
  "Self-Development": "Саморазвитие"
};
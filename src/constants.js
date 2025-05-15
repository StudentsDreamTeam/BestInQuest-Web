export const STATUS_OPTIONS = ["NEW", "PENDING", "IN_PROGRESS", "WAITING_REVIEW", "DONE"];

// Единственный атрибут, который какого-то фига в API передается циферками...мдам...
export const DIFFICULTY_OPTIONS = ["EASY", "SIMPLE", "NORMAL", "HARD", "IMPOSSIBLE"];
export const DIFFICULTY_VALUES = [0, 1, 2, 3, 4];
export const DIFFICULTY_LABELS = {
  0: "Очень легко",
  1: "Легко",
  2: "Средне",
  3: "Сложно",
  4: "Очень сложно",
};

export const PRIORITY_OPTIONS = ["OPTIONAL", "LOW", "NORMAL", "HIGH", "CRITICAL"];
export const IMPORTANT_PRIORITIES = ["HIGH", "CRITICAL"]; // Используется для определения "важности" для стилизации задачи(фиолетовый цвет)
export const PRIORITY_SLIDER_LABELS = {
  0: "Опционально",
  1: "Низкая",
  2: "Обычная",
  3: "Высокая",
  4: "Критическая"
};

export const SPHERE_OPTIONS = ["Sport", "Study", "Household", "Work", "Self-Development"]; // Пока временно массивом.
export const SPHERE_LABELS = {
  "Sport": "Спорт",
  "Study": "Учеба",
  "Household": "Быт",
  "Work": "Работа",
  "Self-Development": "Саморазвитие"
};


import { vi } from 'vitest'

// Функция для создания styled-компонентов
function createStyledComponent(tag) {
  const StyledComponent = (props) => {
    const Component = tag;
    return <Component {...props} />;
  };
  
  // Добавляем метод attrs
  StyledComponent.attrs = (attrs) => {
    return createStyledComponent(tag);
  };
  
  // Добавляем withComponent
  StyledComponent.withComponent = (newTag) => {
    return createStyledComponent(newTag);
  };
  
  return StyledComponent;
}

// Мок для styled-components
vi.mock('styled-components', () => ({
  styled: new Proxy({}, {
    get: function(target, property) {
      return createStyledComponent(property);
    }
  }),
  css: () => '',
  keyframes: () => ''
}))

// Мокаем SVG компоненты
vi.mock('../../../../assets/icons/XPIcon52x28.svg', () => ({
  ReactComponent: () => <div>XP Icon</div>
}))

vi.mock('../../../../assets/icons/StarIcon41x37.svg', () => ({
  ReactComponent: () => <div>Star Icon</div>
}))

vi.mock('../../../../assets/icons/TrashIcon34.svg', () => ({
  ReactComponent: () => <div>Trash Icon</div>
}))

vi.mock('../../../../assets/icons/CheckIcon52.svg', () => ({
  ReactComponent: () => <div>Check Icon</div>
}))

// Мокаем константы
vi.mock('../../../../constants', () => ({
  DIFFICULTY_VALUES: [1, 2, 3, 4, 5],
  DIFFICULTY_LABELS: {
    1: 'Очень легко',
    2: 'Легко',
    3: 'Средне',
    4: 'Сложно',
    5: 'Очень сложно'
  },
  SPHERE_OPTIONS: ['WORK', 'HEALTH', 'RELATIONS', 'DEVELOPMENT'],
  SPHERE_LABELS: {
    WORK: 'Работа',
    HEALTH: 'Здоровье',
    RELATIONS: 'Отношения',
    DEVELOPMENT: 'Развитие'
  },
  PRIORITY_OPTIONS_KEYS: ['LOW', 'NORMAL', 'HIGH'],
  PRIORITY_SLIDER_LABELS: {
    0: 'Низкая',
    1: 'Средняя',
    2: 'Высокая'
  },
  PRIORITY_OPTIONS_MAP: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high'
  }
}))

// Мок для react
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useState: vi.fn().mockImplementation(actual.useState),
    useEffect: vi.fn().mockImplementation(actual.useEffect)
  }
}) 
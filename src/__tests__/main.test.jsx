import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReactDOM from 'react-dom/client';

// Модуль App.jsx нужно мокнуть, чтобы он не рендерился по-настоящему
vi.mock('../App.jsx', () => ({
  default: () => <div data-testid="app-mock">App Mock</div>,
}));

describe('main.jsx', () => {
  let mockRender;
  let mockCreateRoot;
  let rootElement;

  beforeEach(() => {
    // Мокаем document.getElementById
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
    vi.spyOn(document, 'getElementById').mockReturnValue(rootElement);

    // Мокаем ReactDOM.createRoot().render()
    mockRender = vi.fn();
    mockCreateRoot = vi.fn(() => ({ render: mockRender }));
    vi.spyOn(ReactDOM, 'createRoot').mockImplementation(mockCreateRoot);
  });

  afterEach(() => {
    // Очищаем моки и удаляем элемент root
    vi.restoreAllMocks();
    document.body.removeChild(rootElement);
    rootElement = null;
  });

  it('should get the root element and render the App component into it', async () => {
    // Динамически импортируем main.jsx, чтобы его код выполнился в контексте наших моков
    await import('../main.jsx');

    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement);
    expect(mockRender).toHaveBeenCalledTimes(1);
    // Проверяем, что <App /> был передан в render.
    // Первый аргумент первого вызова mockRender это React элемент.
    // Мы можем проверить его тип (должен быть App из нашего мока) или его props.
    // Поскольку App замокан, можно проверить, что это был вызов с JSX.
    // Более точная проверка была бы, если бы App не был мокнут, но тогда тест стал бы интеграционным.
    expect(mockRender.mock.calls[0][0].type.name).toBe('default'); // Имя мокнутого компонента App
    expect(mockRender.mock.calls[0][0].props).toEqual({}); // У <App /> нет пропсов в main.jsx
  });
}); 
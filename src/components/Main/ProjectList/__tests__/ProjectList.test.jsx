import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectList from '../ProjectList';

describe('ProjectList Component', () => {
  const hardcodedProjects = [
    { id: 1, title: 'Проект 1', description: 'Описание первого проекта' },
    { id: 2, title: 'Проект 2', description: 'Описание второго проекта' },
    { id: 3, title: 'Проект 3', description: 'Описание третьего проекта' },
  ];

  it('renders the list of hardcoded projects', () => {
    render(<ProjectList />);

    // Проверяем наличие заголовков и описаний для каждого проекта
    hardcodedProjects.forEach(project => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
    });
  });

  it('renders main container and list container with correct classes', () => {
    const { container } = render(<ProjectList />);
    
    // Проверяем наличие task-list-container (это <main> элемент)
    // querySelector может быть более хрупким, но для проверки класса на корневом элементе от render - нормально
    expect(container.firstChild).toHaveClass('task-list-container');

    // Проверяем наличие task-list внутри
    const taskListDiv = container.querySelector('.task-list');
    expect(taskListDiv).toBeInTheDocument();
  });

  it('renders the correct number of project items', () => {
    render(<ProjectList />);
    // Каждый проект рендерится в div с классом "task"
    const projectItems = screen.getAllByRole('heading', { level: 3 }).map(h => h.closest('.task'));
    // Или можно так, если структура '.task > h3' стабильна:
    // const projectItems = screen.getAllByText(/Проект \d/).map(el => el.closest('.task'));
    expect(projectItems).toHaveLength(hardcodedProjects.length);
  });
}); 
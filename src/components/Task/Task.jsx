import './Task.css';

export default function Task({ task }) {
  return (
    <div className={`task-card ${task.isCompleted ? 'completed' : ''}`}>
      
      <div className="task-details">
        <div className="checkbox-container">
          <div className="checkbox"></div>
        </div>

        <div className="task-info">
          <div className="task-title">{task.title}</div>

          <div className="task-meta">
            <span className="time-icon">⏰</span> {task.startTime}
            &nbsp;&nbsp;
            <span className="clock-icon">⏳</span> {task.duration}
            &nbsp;&nbsp;
            {/* <span className="folder-icon">📁</span> {task.projectName} */}
            <img src="../../icons/Размер=Средняя, Вид=Папка.svg" alt="Средняя папка" />
            &nbsp;&nbsp;
            <span className="user-icon">👤</span> {task.assignee}
            &nbsp;&nbsp;
            <span className="sphere-icon">🌐</span> {task.sphere}
          </div>
        </div>
      </div>

      <div className="delete-button">
        <span className="trash-icon">🗑️</span>
      </div>

    </div>
  );
};
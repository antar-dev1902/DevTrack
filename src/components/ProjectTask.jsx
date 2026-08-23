import Icon from './icons/ImageIcon.jsx';

export default function ProjectTask({ task, onToggle }) {
  return (
    <li className={`project-task ${task.completed ? 'project-task-done' : ''}`}>
      <button
        type="button"
        className="project-task-toggle"
        onClick={onToggle}
        aria-pressed={task.completed}
        aria-label={task.completed ? `Mark "${task.label}" incomplete` : `Mark "${task.label}" complete`}
      >
        {task.completed && <Icon name="check" size={12} />}
      </button>
      <span>{task.label}</span>
    </li>
  );
}

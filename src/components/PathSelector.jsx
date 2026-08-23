import Icon from './icons/ImageIcon.jsx';
import { getPathProgress } from '../data/roadmapData.js';

export default function PathSelector({ paths, selectedId, onSelect, completedSkillIds }) {
  return (
    <div className="path-selector">
      {paths.map((path) => {
        const active = path.id === selectedId;
        const progress = getPathProgress(path, completedSkillIds);
        return (
          <button
            key={path.id}
            type="button"
            className={`path-chip ${active ? 'path-chip-active' : ''}`}
            onClick={() => onSelect(path.id)}
          >
            <span className="path-chip-icon">
              <Icon name={path.icon} size={16} />
            </span>
            <span className="path-chip-text">
              <span className="path-chip-name">{path.name}</span>
              <span className="path-chip-progress">{progress}% complete</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

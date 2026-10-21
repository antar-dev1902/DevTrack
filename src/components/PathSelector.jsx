import Icon from './icons/ImageIcon.jsx';

export default function PathSelector({ paths, selectedId, onSelect }) {
  return (
    <nav className="path-selector" aria-label="Developer paths">
      {paths.map((path) => (
        <button
          key={path.id}
          type="button"
          className={`path-chip ${path.id === selectedId ? 'path-chip-active' : ''}`}
          aria-label={path.name}
          aria-pressed={path.id === selectedId}
          onClick={() => onSelect(path.id)}
        >
          <Icon name={path.icon} size={16} />
          {path.name.replace(' Developer', '')}
        </button>
      ))}
    </nav>
  );
}

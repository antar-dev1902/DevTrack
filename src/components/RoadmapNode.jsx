import Icon from './icons/ImageIcon.jsx';

export default function RoadmapNode({ label, number, status = 'upcoming', onClick, selected }) {
  return (
    <button
      type="button"
      className={`roadmap-node roadmap-node-${status} ${selected ? 'roadmap-node-selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
      aria-current={status === 'current' ? 'step' : undefined}
      aria-label={`${label}${status === 'completed' ? ', completed' : status === 'current' ? ', current skill' : ''}`}
    >
      <span className="roadmap-node-marker" aria-hidden="true">
        {status === 'completed' ? <Icon name="check" size={14} /> : String(number).padStart(2, '0')}
      </span>
      <span className="roadmap-node-label">{label}</span>
      {status === 'current' && <span className="roadmap-node-tag">Current</span>}
    </button>
  );
}

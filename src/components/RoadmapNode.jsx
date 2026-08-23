import Icon from './icons/ImageIcon.jsx';

// status: 'completed' | 'current' | 'upcoming'
export default function RoadmapNode({ label, sublabel, status = 'upcoming', onClick, selected, style }) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={`roadmap-node roadmap-node-${status} ${selected ? 'roadmap-node-selected' : ''}`}
      onClick={onClick}
      style={style}
      type={onClick ? 'button' : undefined}
    >
      <span className="roadmap-node-marker">
        {status === 'completed' && <Icon name="check" size={14} />}
        {status === 'current' && <span className="roadmap-node-dot" />}
        {status === 'upcoming' && <Icon name="lock" size={12} />}
      </span>
      <span className="roadmap-node-text">
        <span className="roadmap-node-label">{label}</span>
        {sublabel && <span className="roadmap-node-sublabel">{sublabel}</span>}
      </span>
      {status === 'current' && <span className="roadmap-node-tag">Current</span>}
    </Tag>
  );
}

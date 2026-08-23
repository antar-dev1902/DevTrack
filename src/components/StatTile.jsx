import Icon from './icons/ImageIcon.jsx';

export default function StatTile({ icon, value, label }) {
  return (
    <div className="stat-tile">
      {icon && (
        <div className="stat-tile-icon">
          <Icon name={icon} size={18} />
        </div>
      )}
      <div>
        <div className="stat-tile-value">{value}</div>
        <div className="stat-tile-label">{label}</div>
      </div>
    </div>
  );
}

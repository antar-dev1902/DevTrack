import Icon from './icons/ImageIcon.jsx';

export default function FilterBar({ options, active, onChange }) {
  return (
    <div className="filter-bar">
      <Icon name="filter" size={15} className="filter-bar-icon" />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`filter-chip ${active === opt.value ? 'filter-chip-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

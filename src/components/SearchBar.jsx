import Icon from './icons/ImageIcon.jsx';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <Icon name="search" size={16} />
      <input
        type="text"
        className="search-bar-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function ProgressBar({ value = 0, size = 'md', showLabel = false, accent = 'default' }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress progress-${size}`}>
      <div className="progress-track">
        <div
          className={`progress-fill ${accent === 'success' ? 'progress-fill-success' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="progress-label">{clamped}%</span>}
    </div>
  );
}

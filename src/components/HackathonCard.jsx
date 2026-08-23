import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';

export function daysRemaining(deadline) {
  const diff = new Date(deadline).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diff / 86400000);
}

export default function HackathonCard({ hackathon }) {
  const days = daysRemaining(hackathon.deadline);
  const countdownLabel =
    days > 0 ? `${days} day${days === 1 ? '' : 's'} remaining` : days === 0 ? 'Closes today' : 'Closed';

  return (
    <div className="hackathon-card card card-hover fade-up">
      <div className="hackathon-card-top">
        <h3>{hackathon.name}</h3>
        <span className="badge">
          <Icon name="target" size={12} />
          {hackathon.mode}
        </span>
      </div>

      <div className="hackathon-card-categories">
        {hackathon.categories.map((c) => (
          <span key={c} className="badge badge-accent">{c}</span>
        ))}
      </div>

      <p className="hackathon-card-desc">{hackathon.description}</p>

      <div className="hackathon-card-meta">
        <div className={`hackathon-countdown ${days <= 3 ? 'hackathon-countdown-urgent' : ''}`}>
          <Icon name="clock" size={14} />
          {countdownLabel}
        </div>
        <div className="hackathon-card-meta-row">
          <Icon name="trophy" size={14} />
          {hackathon.prize}
        </div>
        <div className="hackathon-card-meta-row">
          <Icon name="users" size={14} />
          Team size: {hackathon.teamSize}
        </div>
      </div>

      <Link to={`/hackerhub/${hackathon.id}`} className="btn btn-secondary btn-small hackathon-card-cta">
        View Hackathon
        <Icon name="arrowRight" size={14} />
      </Link>
    </div>
  );
}

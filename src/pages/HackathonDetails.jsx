import { useParams, Link } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import hackathonsData from '../data/hackathonsData.js';
import { daysRemaining } from '../components/HackathonCard.jsx';
import '../styles/hackerHub.css';

export default function HackathonDetails() {
  const { id } = useParams();
  const hackathon = hackathonsData.find((h) => h.id === id);

  if (!hackathon) {
    return (
      <div className="container section">
        <div className="empty-state card">
          <Icon name="search" size={22} />
          <p>This hackathon couldn't be found.</p>
          <Link to="/hackerhub" className="btn btn-secondary btn-small">Back to HackerHub</Link>
        </div>
      </div>
    );
  }

  const days = daysRemaining(hackathon.deadline);

  return (
    <div className="hackathon-details-page section">
      <div className="container">
        <Link to="/hackerhub" className="back-link">
          <Icon name="arrowRight" size={14} className="back-link-icon" />
          Back to HackerHub
        </Link>

        <div className="hackathon-banner">
          <div className="hackathon-banner-glow" aria-hidden="true" />
          <div className="hackathon-card-categories">
            {hackathon.categories.map((c) => (
              <span key={c} className="badge badge-accent">{c}</span>
            ))}
          </div>
          <h2 className="hackathon-banner-title">{hackathon.name}</h2>
          <p className="hackathon-banner-desc">{hackathon.description}</p>
        </div>

        <div className="hackathon-details-grid">
          <div className="hackathon-details-main card">
            <h4>Themes</h4>
            <div className="hackathon-card-categories">
              {hackathon.themes.map((t) => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>

            <h4>Eligibility</h4>
            <p>{hackathon.eligibility}</p>

            <h4>Important dates</h4>
            <ul className="task-list">
              {hackathon.importantDates.map((d) => (
                <li key={d.label}>
                  <Icon name="calendar" size={14} />
                  <strong>{d.label}:</strong>&nbsp;{d.date}
                </li>
              ))}
            </ul>
          </div>

          <div className="hackathon-details-side">
            <div className="card project-details-stat-card">
              <h4>Countdown</h4>
              <div className="hackathon-countdown-large">
                <Icon name="clock" size={16} />
                {days > 0 ? `${days} days remaining` : days === 0 ? 'Closes today' : 'Closed'}
              </div>
            </div>

            <div className="card project-details-stat-card">
              <h4>Prize</h4>
              <div className="project-details-deadline">
                <Icon name="trophy" size={15} />
                {hackathon.prize}
              </div>
            </div>

            <div className="card project-details-stat-card">
              <h4>Team size</h4>
              <div className="project-details-deadline">
                <Icon name="users" size={15} />
                {hackathon.teamSize}
              </div>
            </div>

            <div className="card project-details-stat-card">
              <h4>Mode</h4>
              <div className="project-details-deadline">
                <Icon name="target" size={15} />
                {hackathon.mode}
              </div>
            </div>

            <a href={hackathon.website} target="_blank" rel="noreferrer" className="btn btn-primary">
              Apply / Register
              <Icon name="external" size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import Icon from './icons/ImageIcon.jsx';
import ProgressBar from './ProgressBar.jsx';
import StatTile from './StatTile.jsx';

export default function ProfileCard({
  profile,
  journeyProgress,
  totalXp,
  skillXp,
  projectXp,
  completedSkillCount,
  completedProjectsCount,
}) {
  return (
    <div className="profile-card card">
      <div className="profile-header">
        <div className="profile-avatar">{profile.avatarInitials}</div>
        <div>
          <h2 className="profile-name">{profile.name}</h2>
          <span className="badge badge-accent">{profile.developerPath}</span>
        </div>
        <div className="profile-xp-total">
          <Icon name="zap" size={16} />
          <span>{totalXp.toLocaleString()} XP</span>
        </div>
      </div>

      <p className="profile-bio">{profile.bio}</p>

      <div className="profile-progress">
        <div className="profile-progress-label">
          <span>Journey Progress</span>
          <span className="progress-label">{journeyProgress}%</span>
        </div>
        <ProgressBar value={journeyProgress} />
      </div>

      <div className="profile-section">
        <h4>XP Breakdown</h4>
        <div className="profile-xp-breakdown">
          <span>Skills <strong>{skillXp.toLocaleString()} XP</strong></span>
          <span className="profile-xp-divider" aria-hidden="true" />
          <span>Projects <strong>{projectXp.toLocaleString()} XP</strong></span>
        </div>
      </div>

      <div className="profile-section">
        <h4>Skills</h4>
        <div className="profile-skills">
          {profile.skills.map((s) => (
            <span key={s} className="badge">{s}</span>
          ))}
        </div>
      </div>

      <div className="profile-stats">
        <StatTile icon="check" value={completedSkillCount} label="Skills Completed" />
        <StatTile icon="code" value={completedProjectsCount} label="Projects Completed" />
        <StatTile icon="trophy" value={profile.hackathonsCount} label="Hackathons" />
      </div>

      <div className="profile-links">
        <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-small">
          <Icon name="github" size={15} />
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-small">
          <Icon name="linkedin" size={15} />
          LinkedIn
        </a>
      </div>
    </div>
  );
}

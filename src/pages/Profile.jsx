import Icon from '../components/icons/ImageIcon.jsx';
import ProfileCard from '../components/ProfileCard.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import profileData from '../data/profileData.js';
import { skills } from '../data/roadmapData.js';
import '../styles/profile.css';

const TOTAL_SKILLS = Object.keys(skills).length;

export default function Profile({ totalXp, skillXp, projectXp, completedSkillCount, completedProjectsCount }) {
  const journeyProgress = Math.round((completedSkillCount / TOTAL_SKILLS) * 100);

  return (
    <div className="profile-page section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">
            <Icon name="compass" size={14} />
            Profile
          </span>
          <h2>Where you are right now.</h2>
          <p>A snapshot of your developer journey — not a portfolio, just progress.</p>
        </div>

        <div className="profile-grid">
          <ProfileCard
            profile={profileData}
            journeyProgress={journeyProgress}
            totalXp={totalXp}
            skillXp={skillXp}
            projectXp={projectXp}
            completedSkillCount={completedSkillCount}
            completedProjectsCount={completedProjectsCount}
          />
          <Leaderboard currentUserXp={totalXp} />
        </div>
      </div>
    </div>
  );
}

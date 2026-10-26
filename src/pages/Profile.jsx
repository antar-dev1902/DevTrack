import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import { useSelector } from 'react-redux';
import { selectTotalXp, selectSkillXp, selectProjectXp, selectCompletedSkillCount, selectCompletedProjectsCount } from '../store/selectors.js';
import ProfileCard from '../components/ProfileCard.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import profileData, { getProfileByIdOrEmail } from '../data/profileData.js';
import { skills } from '../data/roadmapData.js';
import '../styles/profile.css';

const TOTAL_SKILLS = Object.keys(skills).length;

export default function Profile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const profile = useMemo(() => {
    if (userId) return getProfileByIdOrEmail(userId);
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('devtrack_current_user') : null;
      if (stored) return JSON.parse(stored);
      const storedId = typeof window !== 'undefined' ? localStorage.getItem('devtrack_current_user_id') : null;
      if (storedId) return getProfileByIdOrEmail(storedId);
    } catch {
      // storage unavailable
    }
    return profileData;
  }, [userId]);

  const totalXp = useSelector(selectTotalXp);
  const skillXp = useSelector(selectSkillXp);
  const projectXp = useSelector(selectProjectXp);
  const completedSkillCount = useSelector(selectCompletedSkillCount);
  const completedProjectsCount = useSelector(selectCompletedProjectsCount);
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
            profile={profile}
            journeyProgress={journeyProgress}
            totalXp={totalXp}
            skillXp={skillXp}
            projectXp={projectXp}
            completedSkillCount={completedSkillCount}
            completedProjectsCount={completedProjectsCount}
          />
          <Leaderboard currentUserXp={totalXp} currentUserName={profile.name} />
        </div>
      </div>
    </div>
  );
}

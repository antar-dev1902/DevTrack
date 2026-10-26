import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import { useSelector } from 'react-redux';
import {
  selectTotalXp,
  selectSkillXp,
  selectProjectXp,
  selectCompletedSkillCount,
  selectCompletedProjectsCount,
} from '../store/selectors.js';
import ProfileCard from '../components/ProfileCard.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import { useAuth } from '../context/AuthContext.js';
import { skills } from '../data/roadmapData.js';
import '../styles/profile.css';

const TOTAL_SKILLS = Object.keys(skills).length;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Route protection: redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Authorization check: prevent unauthorized profile access via URL manipulation
  useEffect(() => {
    if (user) {
      const paramUserId = searchParams.get('userId');
      if (paramUserId && paramUserId !== user.id) {
        setSearchParams({ userId: user.id }, { replace: true });
      }
    }
  }, [user, searchParams, setSearchParams]);

  const totalXp = useSelector(selectTotalXp);
  const skillXp = useSelector(selectSkillXp);
  const projectXp = useSelector(selectProjectXp);
  const completedSkillCount = useSelector(selectCompletedSkillCount);
  const completedProjectsCount = useSelector(selectCompletedProjectsCount);
  const journeyProgress = Math.round((completedSkillCount / TOTAL_SKILLS) * 100);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            profile={user}
            journeyProgress={journeyProgress}
            totalXp={totalXp}
            skillXp={skillXp}
            projectXp={projectXp}
            completedSkillCount={completedSkillCount}
            completedProjectsCount={completedProjectsCount}
            onLogout={handleLogout}
          />
          <Leaderboard currentUserXp={totalXp} currentUserName={user.name} />
        </div>
      </div>
    </div>
  );
}

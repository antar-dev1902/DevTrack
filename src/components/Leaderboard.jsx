import { useMemo } from 'react';
import Icon from './icons/ImageIcon.jsx';
import LeaderboardRow from './LeaderboardRow.jsx';
import leaderboardData from '../data/leaderboardData.js';
import profileData from '../data/profileData.js';

export default function Leaderboard({ currentUserXp }) {
  const ranked = useMemo(() => {
    const allUsers = [
      ...leaderboardData,
      { id: 'you', name: profileData.name, xp: currentUserXp, isCurrentUser: true },
    ];
    return [...allUsers].sort((a, b) => b.xp - a.xp);
  }, [currentUserXp]);

  return (
    <div className="leaderboard card">
      <div className="leaderboard-header">
        <Icon name="trophy" size={16} />
        <h3>Leaderboard</h3>
      </div>
      <ul className="leaderboard-list">
        {ranked.map((user, i) => (
          <LeaderboardRow key={user.id} rank={i + 1} name={user.name} xp={user.xp} isCurrentUser={!!user.isCurrentUser} />
        ))}
      </ul>
    </div>
  );
}

const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardRow({ rank, name, xp, isCurrentUser }) {
  return (
    <li className={`leaderboard-row ${isCurrentUser ? 'leaderboard-row-you' : ''}`}>
      <span className="leaderboard-rank">{medals[rank] || rank}</span>
      <span className="leaderboard-name">
        {name}
        {isCurrentUser && <span className="leaderboard-you-tag">YOU</span>}
      </span>
      <span className="leaderboard-xp">{xp.toLocaleString()} XP</span>
    </li>
  );
}

// Static demo leaderboard users (PRD §45). The current user's row is
// intentionally NOT included here — Profile.jsx merges in the live,
// computed XP for the real user so the leaderboard always reflects actual
// progress rather than a stale seed number.
const leaderboardData = [
  { id: 1, name: 'Rahul Sharma', xp: 1250 },
  { id: 3, name: 'Aman Verma', xp: 650 },
  { id: 4, name: 'Japneet Kaur', xp: 520 },
  { id: 5, name: 'Harpreet Singh', xp: 450 },
];

export default leaderboardData;

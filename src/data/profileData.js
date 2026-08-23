// projectsCount / journeyProgress are intentionally NOT here — Profile.jsx
// derives those from real completion state so they can never drift out of
// sync with the roadmap/projects pages. hackathonsCount stays static demo
// data since HackerHub doesn't track real "applied" state.
const profileData = {
  name: 'Antarjot Singh',
  developerPath: 'Frontend Developer',
  bio: 'Learning by building — currently deep in React, working toward full-stack fluency one project at a time.',
  avatarInitials: 'A',
  skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Python'],
  hackathonsCount: 4,
  github: 'https://github.com/',
  linkedin: 'https://linkedin.com/',
};

export default profileData;

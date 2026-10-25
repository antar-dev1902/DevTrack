// projectsCount / journeyProgress are intentionally NOT here — Profile.jsx
// derives those from real completion state so they can never drift out of
// sync with the roadmap/projects pages. hackathonsCount stays static demo
// data since HackerHub doesn't track real "applied" state.
const profileData = {
  id: 'u-1',
  email: 'antarjot@example.com',
  name: 'Antarjot Singh',
  developerPath: 'Frontend Developer',
  bio: 'Learning by building — currently deep in React, working toward full-stack fluency one project at a time.',
  avatarInitials: 'A',
  skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Python'],
  hackathonsCount: 4,
  github: 'https://github.com/',
  linkedin: 'https://linkedin.com/',
};

export const demoProfiles = [
  profileData,
  {
    id: 'u-2',
    email: 'jordan@example.com',
    name: 'Jordan Lee',
    developerPath: 'Full Stack Developer',
    bio: 'Full-stack builder passionate about React, Node.js, and cloud native architectures.',
    avatarInitials: 'J',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    hackathonsCount: 3,
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 'u-3',
    email: 'alex@example.com',
    name: 'Alex Chen',
    developerPath: 'Backend Developer',
    bio: 'Specializing in high-throughput APIs, distributed systems, and database optimization.',
    avatarInitials: 'A',
    skills: ['Node.js', 'Python', 'Express', 'MongoDB', 'System Design'],
    hackathonsCount: 5,
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: 'u-4',
    email: 'priya@example.com',
    name: 'Priya Sharma',
    developerPath: 'AI/ML Developer',
    bio: 'Exploring neural networks, NLP, and deploying machine learning models into production apps.',
    avatarInitials: 'P',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'DSA', 'FastAPI'],
    hackathonsCount: 2,
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
  },
];

export function getProfileByIdOrEmail(identifier) {
  if (!identifier) return profileData;
  const cleanId = String(identifier).trim().toLowerCase();

  // 1. Check custom registered users in localStorage
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('devtrack_users') : null;
    if (raw) {
      const users = JSON.parse(raw);
      if (Array.isArray(users)) {
        const found = users.find(
          (u) => u.id?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId,
        );
        if (found) return found;
      }
    }
  } catch {
    // Ignore storage errors
  }

  // 2. Check demo profiles
  const demoFound = demoProfiles.find(
    (u) => u.id?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId,
  );
  if (demoFound) return demoFound;

  // 3. Fallback: if it's an email format, dynamically construct a sensible user profile
  if (cleanId.includes('@')) {
    const rawName = cleanId.split('@')[0];
    const formattedName = rawName
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      id: `u-${rawName}`,
      email: identifier,
      name: formattedName,
      developerPath: 'Frontend Developer',
      bio: 'Learning and building projects on DevTrack.',
      avatarInitials: formattedName.charAt(0) || 'U',
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      hackathonsCount: 1,
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/',
    };
  }

  return profileData;
}

export default profileData;

// Static seed project data. Progress and status are derived from `tasks` at
// runtime (see projects.js helpers below), never stored directly, so there's
// a single source of truth for completion.
//
// Every skill in roadmapData.js points at one of these via `relatedProject` —
// that's the "Related project" recommendation shown on the skill panel. A
// handful of projects are deliberately shared across a few closely related
// skills (e.g. one Task Manager API demonstrates REST APIs, Node/Express, AND
// full-stack API building) rather than manufacturing a separate project per
// skill for its own sake.
//
// 4 of these (p1-p4) ship pre-completed by default so the fresh-install XP
// total matches the worked example: 300 skill XP + 400 project XP = 700 XP.
// Every other seed project intentionally starts below 100% so that total
// doesn't drift when the catalog grows.

function tasks(labels, completedCount) {
  return labels.map((label, i) => ({
    id: `t${i + 1}`,
    label,
    completed: i < completedCount,
  }));
}

const projectsData = [
  {
    id: 'p1',
    name: 'Personal Portfolio',
    description: 'A responsive personal site to showcase who you are as a developer, built while learning the fundamentals of the web.',
    technologies: ['HTML', 'CSS'],
    tasks: tasks(['Semantic page structure', 'Responsive layout', 'Accessible navigation', 'Deploy site'], 4),
    learningObjective: 'HTML & CSS fundamentals',
    nextStep: 'Add a projects section',
  },
  {
    id: 'p2',
    name: 'Todo App',
    description: 'A local todo list app used to practice DOM manipulation, event handling, and state without a framework.',
    technologies: ['JavaScript', 'DOM', 'CSS'],
    tasks: tasks(['Add / remove tasks', 'Mark complete', 'Persist with localStorage', 'Polish UI'], 4),
    learningObjective: 'JavaScript & DOM manipulation',
    nextStep: 'Refactor into React',
  },
  {
    id: 'p3',
    name: 'Landing Page Clone',
    description: 'A pixel-focused clone of a real product landing page, built to practice layout precision and responsive design.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    tasks: tasks(['Build hero section', 'Build pricing section', 'Add responsive breakpoints', 'Add scroll animations'], 4),
    learningObjective: 'Responsive layout & CSS animation',
    nextStep: 'Ship a second variant',
  },
  {
    id: 'p4',
    name: 'CLI Todo Tool',
    description: 'A small command-line todo manager built to practice control flow, data structures, and error handling outside the browser.',
    technologies: ['Node.js', 'JavaScript'],
    tasks: tasks(['Parse CLI arguments', 'Read/write a local JSON file', 'Add/list/complete commands', 'Handle bad input gracefully'], 4),
    learningObjective: 'Programming fundamentals in practice',
    nextStep: 'Add due dates',
  },
  {
    id: 'p5',
    name: 'Weather App',
    description: 'A weather lookup app that consumes a public API and renders live conditions with React state and effects.',
    technologies: ['React', 'API', 'CSS'],
    tasks: tasks(['Project scaffold', 'City search UI', 'Loading & error states', 'Connect weather API', 'Add 5-day forecast'], 3),
    learningObjective: 'React state, effects, and API integration',
    nextStep: 'Connect the live weather API',
  },
  {
    id: 'p6',
    name: 'Task Manager API',
    description: 'A REST API for managing tasks and projects, used to practice backend routing, validation, and data modeling.',
    technologies: ['Node.js', 'Express', 'REST API'],
    tasks: tasks(['Project setup', 'Basic routing', 'Resource design', 'Request validation'], 2),
    learningObjective: 'REST API design',
    nextStep: 'Add request validation',
  },
  {
    id: 'p7',
    name: 'Habit Tracker',
    description: 'A habit tracking dashboard with streaks and progress charts, built as a Next.js learning project.',
    technologies: ['Next.js', 'React', 'Charts'],
    tasks: tasks(['Define data model', 'Build habit list UI', 'Add streak tracking', 'Add charts'], 0),
    learningObjective: 'Next.js fundamentals',
    nextStep: 'Set up the project and define the data model',
  },
  {
    id: 'p8',
    name: 'Full-Stack Blog with Auth',
    description: 'A blog platform where users can sign up, log in, and publish posts — built to connect a React frontend to a real backend with authentication.',
    technologies: ['React', 'API', 'Auth'],
    tasks: tasks(['Build post feed UI', 'Connect posts API', 'Add login & signup flow', 'Protect authenticated routes', 'Handle auth errors'], 1),
    learningObjective: 'Consuming APIs & auth flows end-to-end',
    nextStep: 'Add login & signup flow',
  },
  {
    id: 'p9',
    name: 'Library Database & Admin Dashboard',
    description: 'A book-lending admin dashboard backed by a relational database, built to practice schema design, joins, and indexing.',
    technologies: ['SQL', 'Database Design'],
    tasks: tasks(['Design the schema', 'Write seed data', 'Build borrower & book queries', 'Add search with indexes'], 1),
    learningObjective: 'Relational schema design & queries',
    nextStep: 'Build borrower & book queries',
  },
  {
    id: 'p10',
    name: 'Auth System (Login & Sessions)',
    description: 'A standalone login system implementing sessions and password hashing from scratch, to understand what auth libraries do under the hood.',
    technologies: ['Node.js', 'Sessions', 'Security'],
    tasks: tasks(['Hash & store passwords', 'Build login/logout routes', 'Implement session middleware', 'Add a JWT-based alternative'], 0),
    learningObjective: 'Sessions, JWTs, and password hashing',
    nextStep: 'Hash & store passwords',
  },
  {
    id: 'p11',
    name: 'URL Shortener with Caching',
    description: 'A URL shortening service that adds a caching layer, used to explore performance and scaling concepts hands-on.',
    technologies: ['Node.js', 'Caching', 'System Design'],
    tasks: tasks(['Build shorten & redirect routes', 'Add an in-memory cache', 'Add click analytics', 'Write a load-balancing writeup'], 0),
    learningObjective: 'Caching & load balancing fundamentals',
    nextStep: 'Build shorten & redirect routes',
  },
  {
    id: 'p12',
    name: 'CI/CD Deployment Pipeline',
    description: 'An automated pipeline that tests and deploys a sample app on every push, built to practice DevOps fundamentals.',
    technologies: ['CI/CD', 'GitHub Actions', 'Monitoring'],
    tasks: tasks(['Write automated tests', 'Set up a CI workflow', 'Auto-deploy on push', 'Add basic uptime monitoring'], 0),
    learningObjective: 'CI/CD & monitoring basics',
    nextStep: 'Write automated tests',
  },
  {
    id: 'p13',
    name: 'Python Data Analysis Toolkit',
    description: "A set of Python scripts that clean, analyze, and summarize a real dataset using NumPy and Pandas.",
    technologies: ['Python', 'NumPy', 'Pandas'],
    tasks: tasks(['Load & inspect a dataset', 'Clean missing values', 'Compute summary statistics', 'Write reusable analysis functions'], 1),
    learningObjective: 'Python data tooling & math foundations',
    nextStep: 'Clean missing values',
  },
  {
    id: 'p14',
    name: 'DSA Problem Tracker',
    description: "A small app that logs which data structure & algorithm problems you've solved, tagged by pattern, to track interview prep deliberately.",
    technologies: ['JavaScript', 'Algorithms'],
    tasks: tasks(['Define problem/pattern data model', 'Build add-problem form', 'Tag by pattern (arrays, trees, DP)', 'Add solved-count stats'], 0),
    learningObjective: 'Practicing DSA patterns deliberately',
    nextStep: 'Define problem/pattern data model',
  },
  {
    id: 'p15',
    name: 'ML Classifier: Spam Detector',
    description: 'A spam-vs-not-spam email classifier trained with scikit-learn, used to practice the full machine learning modeling loop.',
    technologies: ['Python', 'scikit-learn'],
    tasks: tasks(['Prepare & vectorize text data', 'Train a baseline classifier', 'Evaluate precision & recall', 'Tune and compare models'], 0),
    learningObjective: 'Classification & model evaluation',
    nextStep: 'Prepare & vectorize text data',
  },
  {
    id: 'p16',
    name: 'Image Classifier with Neural Network',
    description: 'A neural network that classifies images into categories, built to understand how layers, weights, and training actually work.',
    technologies: ['Python', 'Deep Learning'],
    tasks: tasks(['Load & preprocess an image dataset', 'Build a small neural network', 'Train and track accuracy', 'Try a CNN architecture'], 0),
    learningObjective: 'Neural networks & CNNs',
    nextStep: 'Load & preprocess an image dataset',
  },
  {
    id: 'p17',
    name: 'Model Deployment API',
    description: "A trained model served behind a REST API, with basic monitoring for when its predictions start drifting from reality.",
    technologies: ['Python', 'API', 'MLOps'],
    tasks: tasks(['Wrap a trained model in an API', 'Add input validation', 'Log predictions', 'Add a simple drift check'], 0),
    learningObjective: 'Model serving & monitoring',
    nextStep: 'Wrap a trained model in an API',
  },
  {
    id: 'p18',
    name: 'Statistical Analysis Report',
    description: 'A written analysis of a public dataset that tests a real hypothesis and models the relationship between two variables.',
    technologies: ['Python', 'Statistics'],
    tasks: tasks(['Compute descriptive statistics', 'Run a hypothesis test', 'Fit a regression model', 'Write up the findings'], 0),
    learningObjective: 'Hypothesis testing & regression',
    nextStep: 'Compute descriptive statistics',
  },
  {
    id: 'p19',
    name: 'Data Cleaning Pipeline',
    description: 'A repeatable pipeline that takes a messy raw dataset and turns it into something analysis-ready.',
    technologies: ['Python', 'Pandas'],
    tasks: tasks(['Audit the raw data for issues', 'Handle missing values', 'Fix inconsistent formatting', 'Export a clean dataset'], 1),
    learningObjective: 'Cleaning & reshaping real-world data',
    nextStep: 'Handle missing values',
  },
  {
    id: 'p20',
    name: 'Interactive Data Dashboard',
    description: 'A multi-chart dashboard that turns a dataset into something a stakeholder could actually act on.',
    technologies: ['Python', 'Matplotlib', 'Seaborn'],
    tasks: tasks(['Pick key metrics to visualize', 'Build individual charts', 'Lay out a dashboard view', 'Add filtering'], 0),
    learningObjective: 'Visualization & dashboard design',
    nextStep: 'Pick key metrics to visualize',
  },
  {
    id: 'p21',
    name: 'Data Story Presentation',
    description: 'A short presentation that turns an analysis into a narrative stakeholders can act on, not just a wall of charts.',
    technologies: ['Storytelling', 'Presentation'],
    tasks: tasks(['Pick the core finding', 'Structure the narrative', 'Design supporting slides', 'Practice the pitch'], 0),
    learningObjective: 'Framing analysis as a narrative',
    nextStep: 'Pick the core finding',
  },
];

export default projectsData;

export const projectNameLookup = Object.fromEntries(projectsData.map((p) => [p.id, p.name]));

export function getProjectProgress(project) {
  if (!project.tasks.length) return 0;
  const done = project.tasks.filter((t) => t.completed).length;
  return Math.round((done / project.tasks.length) * 100);
}

export function getProjectStatus(project) {
  const progress = getProjectProgress(project);
  if (progress === 100) return 'Completed';
  if (progress === 0) return 'Not Started';
  return 'In Progress';
}

export function isProjectComplete(project) {
  return project.tasks.length > 0 && project.tasks.every((t) => t.completed);
}

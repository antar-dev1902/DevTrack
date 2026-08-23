// Static roadmap data: developer paths → ordered skills → learning modules.
//
// Skills intentionally do NOT carry a hardcoded status/progress here — whether
// a skill is "completed", "current", or "upcoming" is computed at runtime from
// the user's real completedSkillIds (see hooks/useLocalStorage + App.jsx),
// based on position in the path. The module list below is static educational
// content (per PRD §20) — short explanations, not interactive per-module state.

export const paths = [
  {
    id: 'frontend',
    name: 'Frontend Developer',
    icon: 'layout',
    description: 'Ship polished, interactive interfaces with modern JavaScript frameworks.',
    skillIds: ['fe-html', 'fe-css', 'fe-js', 'fe-react', 'fe-nextjs', 'fe-fullstack'],
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    icon: 'layers',
    description: 'Design APIs, databases, and services that power real applications.',
    skillIds: ['be-fundamentals', 'be-databases', 'be-apis', 'be-node', 'be-auth', 'be-system-design'],
  },
  {
    id: 'fullstack',
    name: 'Full Stack Developer',
    icon: 'code',
    description: 'Own the whole stack, from the UI down to the database.',
    skillIds: ['fs-htmlcss', 'fs-js', 'fs-react', 'fs-node-apis', 'fs-databases', 'fs-devops'],
  },
  {
    id: 'aiml',
    name: 'AI/ML Developer',
    icon: 'target',
    description: 'Build and ship models, not just notebooks.',
    skillIds: ['ai-python', 'ai-math', 'ai-dsa', 'ai-ml-basics', 'ai-deep-learning', 'ai-mlops'],
  },
  {
    id: 'datascience',
    name: 'Data Scientist',
    icon: 'compass',
    description: 'Turn raw data into decisions people actually act on.',
    skillIds: ['ds-python', 'ds-stats', 'ds-wrangling', 'ds-viz', 'ds-ml', 'ds-storytelling'],
  },
];

// Skills that are pre-marked complete on a fresh install (no localStorage yet).
// 6 skills × 50 XP = 300 XP, matching the PRD's worked XP example so the demo
// isn't a blank slate the first time someone opens it.
export const defaultCompletedSkillIds = ['fe-html', 'fe-css', 'fe-js', 'be-fundamentals', 'be-databases', 'ai-python'];

export const skills = {
  // ---- Frontend ----
  'fe-html': {
    id: 'fe-html', name: 'HTML',
    description: 'Semantic markup and document structure — the foundation everything else sits on.',
    modules: [
      { id: 'm1', name: 'Document structure', status: 'completed', desc: 'The skeleton of every HTML page: doctype, html, head, and body, and why each one matters.' },
      { id: 'm2', name: 'Semantic tags', status: 'completed', desc: 'Tags like header, nav, main, and footer that describe meaning, not just layout — better for accessibility and SEO.' },
      { id: 'm3', name: 'Forms', status: 'completed', desc: 'Collecting user input with input, textarea, and select, and how labels and validation attributes tie it together.' },
      { id: 'm4', name: 'Accessibility basics', status: 'completed', desc: 'Alt text, focus order, and ARIA basics that make a page usable with a keyboard or screen reader.' },
    ],
    resources: [
      { label: 'MDN: HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
      { label: 'web.dev: Learn HTML', url: 'https://web.dev/learn/html' },
    ],
    relatedProject: 'p1',
  },
  'fe-css': {
    id: 'fe-css', name: 'CSS',
    description: 'Layout, responsive design, and visual styling.',
    modules: [
      { id: 'm1', name: 'Box model', status: 'completed', desc: 'Every element is a box: content, padding, border, and margin, and how they add up to its final size.' },
      { id: 'm2', name: 'Flexbox', status: 'completed', desc: 'A one-dimensional layout system for aligning and distributing items along a row or column.' },
      { id: 'm3', name: 'Grid', status: 'completed', desc: 'A two-dimensional layout system for building full page layouts with rows and columns at once.' },
      { id: 'm4', name: 'Responsive design', status: 'completed', desc: 'Media queries, fluid units, and mobile-first thinking so a layout adapts across screen sizes.' },
    ],
    resources: [
      { label: 'CSS-Tricks: A Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
      { label: 'MDN: CSS Grid', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout' },
    ],
    relatedProject: 'p1',
  },
  'fe-js': {
    id: 'fe-js', name: 'JavaScript',
    description: 'The language that makes the web interactive.',
    modules: [
      { id: 'm1', name: 'Variables & functions', status: 'completed', desc: 'Storing values and packaging reusable logic — the two building blocks of every script.' },
      { id: 'm2', name: 'Arrays & objects', status: 'completed', desc: "JavaScript's core data structures for lists and key-value data, plus the methods that manipulate them." },
      { id: 'm3', name: 'DOM manipulation', status: 'completed', desc: 'Reading and changing what’s on the page from JavaScript: selecting elements, updating content, handling events.' },
      { id: 'm4', name: 'Async JavaScript', status: 'completed', desc: 'Promises and async/await for handling things that take time, like network requests, without blocking the page.' },
      { id: 'm5', name: 'Fetch & APIs', status: 'completed', desc: 'Using the Fetch API to request data from a server and work with the JSON it returns.' },
    ],
    resources: [
      { label: 'javascript.info', url: 'https://javascript.info/' },
      { label: 'MDN: JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
    ],
    relatedProject: 'p2',
  },
  'fe-react': {
    id: 'fe-react', name: 'React',
    description: 'Component-driven UI with state, props, and hooks.',
    modules: [
      { id: 'm1', name: 'Introduction', status: 'completed', desc: 'What React is, why components exist, and how JSX lets you describe UI with JavaScript.' },
      { id: 'm2', name: 'Components & props', status: 'completed', desc: 'Breaking UI into reusable pieces and passing data into them via props.' },
      { id: 'm3', name: 'State & events', status: 'completed', desc: 'Giving a component memory with useState, and responding to clicks, input, and other events.' },
      { id: 'm4', name: 'Arrays & lists', status: 'current', desc: 'Rendering dynamic lists with .map() and why each item needs a stable key.' },
      { id: 'm5', name: 'useEffect & data fetching', status: 'upcoming', desc: 'Running side effects — like fetching data — in response to renders and dependency changes.' },
      { id: 'm6', name: 'Custom hooks', status: 'upcoming', desc: 'Extracting reusable stateful logic out of components into your own hook functions.' },
      { id: 'm7', name: 'Routing', status: 'upcoming', desc: 'Moving between pages or views in a React app without a full page reload.' },
    ],
    resources: [
      { label: 'react.dev docs', url: 'https://react.dev/learn' },
      { label: 'Epic React fundamentals', url: 'https://www.epicreact.dev/' },
    ],
    relatedProject: 'p5',
  },
  'fe-nextjs': {
    id: 'fe-nextjs', name: 'Next.js',
    description: 'Server rendering, routing, and full-stack React apps.',
    modules: [
      { id: 'm1', name: 'App router', status: 'upcoming', desc: 'File-based routing in Next.js, where folders and files under app/ define your routes.' },
      { id: 'm2', name: 'Server components', status: 'upcoming', desc: 'Components that render on the server by default, and when you actually need client-side interactivity.' },
      { id: 'm3', name: 'Data fetching', status: 'upcoming', desc: 'Fetching data directly inside server components without a separate API layer.' },
      { id: 'm4', name: 'Deployment', status: 'upcoming', desc: 'Shipping a Next.js app to production and what changes between dev and a real deployment.' },
    ],
    resources: [{ label: 'nextjs.org/learn', url: 'https://nextjs.org/learn' }],
    relatedProject: 'p7',
  },
  'fe-fullstack': {
    id: 'fe-fullstack', name: 'Full Stack Frontend Systems',
    description: 'Connecting your frontend to real APIs, auth, and deployment pipelines.',
    modules: [
      { id: 'm1', name: 'Consuming REST APIs', status: 'upcoming', desc: 'Calling a backend API from your frontend and handling loading, error, and success states.' },
      { id: 'm2', name: 'Auth flows', status: 'upcoming', desc: 'How login, sessions, and tokens flow between a frontend and a backend in practice.' },
      { id: 'm3', name: 'CI/CD basics', status: 'upcoming', desc: 'Automatically testing and deploying your app whenever you push code.' },
    ],
    resources: [],
    relatedProject: 'p8',
  },

  // ---- Backend ----
  'be-fundamentals': {
    id: 'be-fundamentals', name: 'Programming Fundamentals',
    description: 'Core logic, data structures, and problem solving.',
    modules: [
      { id: 'm1', name: 'Control flow', status: 'completed', desc: 'Conditionals and loops — the logic that decides what a program does next.' },
      { id: 'm2', name: 'Data structures', status: 'completed', desc: 'Arrays, lists, maps, and sets, and picking the right one for the problem.' },
      { id: 'm3', name: 'Error handling', status: 'completed', desc: 'Catching and responding to failures gracefully instead of letting a program crash.' },
    ],
    resources: [{ label: 'CS50: Introduction to Computer Science', url: 'https://cs50.harvard.edu/x/' }],
    relatedProject: 'p4',
  },
  'be-databases': {
    id: 'be-databases', name: 'Databases (SQL)',
    description: 'Relational data modeling and query design.',
    modules: [
      { id: 'm1', name: 'Schema design', status: 'completed', desc: 'Deciding what tables and columns you need, and how they relate to each other.' },
      { id: 'm2', name: 'Joins & queries', status: 'completed', desc: 'Combining data across tables and writing queries that get exactly what you need.' },
      { id: 'm3', name: 'Indexing basics', status: 'completed', desc: 'Speeding up queries by helping the database find rows without scanning everything.' },
    ],
    resources: [
      { label: 'SQLBolt', url: 'https://sqlbolt.com/' },
      { label: 'PostgreSQL docs', url: 'https://www.postgresql.org/docs/' },
    ],
    relatedProject: 'p9',
  },
  'be-apis': {
    id: 'be-apis', name: 'REST APIs',
    description: 'Designing clean, predictable HTTP APIs.',
    modules: [
      { id: 'm1', name: 'HTTP fundamentals', status: 'completed', desc: 'Methods, status codes, and headers — the vocabulary every API is built on.' },
      { id: 'm2', name: 'Resource design', status: 'current', desc: 'Modeling your API around resources and predictable URLs instead of one-off endpoints.' },
      { id: 'm3', name: 'Validation & errors', status: 'upcoming', desc: 'Rejecting bad input early and returning error responses clients can actually act on.' },
      { id: 'm4', name: 'Versioning', status: 'upcoming', desc: 'Changing an API over time without breaking the clients already using it.' },
    ],
    resources: [{ label: 'REST API design guide', url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design' }],
    relatedProject: 'p6',
  },
  'be-node': {
    id: 'be-node', name: 'Node.js & Express',
    description: 'Server-side JavaScript runtime and routing.',
    modules: [
      { id: 'm1', name: 'Event loop', status: 'upcoming', desc: 'How Node.js handles many operations at once on a single thread without blocking.' },
      { id: 'm2', name: 'Express routing', status: 'upcoming', desc: "Mapping HTTP requests to handler functions with Express's routing system." },
      { id: 'm3', name: 'Middleware', status: 'upcoming', desc: 'Functions that run between a request and its handler — for logging, auth, parsing, and more.' },
    ],
    resources: [],
    relatedProject: 'p6',
  },
  'be-auth': {
    id: 'be-auth', name: 'Authentication & Security',
    description: 'Sessions, tokens, and keeping user data safe.',
    modules: [
      { id: 'm1', name: 'Sessions vs JWT', status: 'upcoming', desc: 'Two common ways to keep a user logged in, and the tradeoffs between them.' },
      { id: 'm2', name: 'Password hashing', status: 'upcoming', desc: 'Never storing plain-text passwords — hashing and salting them instead.' },
    ],
    resources: [],
    relatedProject: 'p10',
  },
  'be-system-design': {
    id: 'be-system-design', name: 'System Design',
    description: 'Scaling services and designing for reliability.',
    modules: [
      { id: 'm1', name: 'Caching', status: 'upcoming', desc: 'Storing expensive results temporarily so repeat requests are fast.' },
      { id: 'm2', name: 'Load balancing', status: 'upcoming', desc: 'Spreading traffic across multiple servers so no single one gets overwhelmed.' },
    ],
    resources: [],
    relatedProject: 'p11',
  },

  // ---- Full Stack ----
  'fs-htmlcss': {
    id: 'fs-htmlcss', name: 'HTML & CSS',
    description: 'Markup and styling fundamentals.',
    modules: [
      { id: 'm1', name: 'Structure & layout', status: 'upcoming', desc: "Building a page's structure with HTML and laying it out with CSS." },
      { id: 'm2', name: 'Responsive design', status: 'upcoming', desc: 'Making that layout adapt cleanly from mobile to desktop.' },
    ],
    resources: [],
    relatedProject: 'p1',
  },
  'fs-js': {
    id: 'fs-js', name: 'JavaScript',
    description: 'Core language skills for both client and server.',
    modules: [
      { id: 'm1', name: 'Fundamentals', status: 'upcoming', desc: 'Core JavaScript syntax, variables, functions, and control flow.' },
      { id: 'm2', name: 'Async patterns', status: 'upcoming', desc: 'Handling asynchronous work with promises and async/await.' },
    ],
    resources: [],
    relatedProject: 'p2',
  },
  'fs-react': {
    id: 'fs-react', name: 'React',
    description: 'Building interactive UIs with components.',
    modules: [
      { id: 'm1', name: 'Components & state', status: 'upcoming', desc: 'Building UI out of components that manage and react to their own state.' },
      { id: 'm2', name: 'Hooks', status: 'upcoming', desc: "Using React's built-in hooks to add state, effects, and more to function components." },
    ],
    resources: [],
    relatedProject: 'p5',
  },
  'fs-node-apis': {
    id: 'fs-node-apis', name: 'Node.js & APIs',
    description: 'Building the server side of your application.',
    modules: [
      { id: 'm1', name: 'Express basics', status: 'upcoming', desc: 'Standing up a server and defining routes with Express.' },
      { id: 'm2', name: 'Building endpoints', status: 'upcoming', desc: 'Designing the actual endpoints your frontend will call.' },
      { id: 'm3', name: 'Error handling', status: 'upcoming', desc: 'Returning consistent, useful errors when something goes wrong server-side.' },
    ],
    resources: [],
    relatedProject: 'p6',
  },
  'fs-databases': {
    id: 'fs-databases', name: 'Databases',
    description: 'Persisting and querying application data.',
    modules: [
      { id: 'm1', name: 'SQL fundamentals', status: 'upcoming', desc: 'Reading and writing data with SQL: select, insert, update, delete.' },
      { id: 'm2', name: 'ORMs', status: 'upcoming', desc: 'Working with your database through JavaScript objects instead of raw SQL.' },
    ],
    resources: [],
    relatedProject: 'p9',
  },
  'fs-devops': {
    id: 'fs-devops', name: 'Deployment & DevOps',
    description: 'Shipping and monitoring your app in production.',
    modules: [
      { id: 'm1', name: 'CI/CD', status: 'upcoming', desc: 'Automating tests and deployments so shipping changes is routine, not risky.' },
      { id: 'm2', name: 'Monitoring basics', status: 'upcoming', desc: 'Knowing when your app breaks in production before your users tell you.' },
    ],
    resources: [],
    relatedProject: 'p12',
  },

  // ---- AI/ML ----
  'ai-python': {
    id: 'ai-python', name: 'Python',
    description: 'The primary language for ML tooling and research.',
    modules: [
      { id: 'm1', name: 'Syntax & data types', status: 'completed', desc: "Python's core syntax and the data types you'll use constantly in ML code." },
      { id: 'm2', name: 'NumPy & Pandas', status: 'completed', desc: 'The two libraries almost all Python data work is built on: arrays and dataframes.' },
    ],
    resources: [],
    relatedProject: 'p13',
  },
  'ai-math': {
    id: 'ai-math', name: 'Math for ML',
    description: 'Linear algebra, calculus, and probability that models rely on.',
    modules: [
      { id: 'm1', name: 'Linear algebra', status: 'current', desc: 'Vectors and matrices — the math that represents data and model weights.' },
      { id: 'm2', name: 'Probability & statistics', status: 'upcoming', desc: "Reasoning about uncertainty, distributions, and what a model's predictions actually mean." },
    ],
    resources: [],
    relatedProject: 'p13',
  },
  'ai-dsa': {
    id: 'ai-dsa', name: 'Data Structures & Algorithms',
    description: 'Efficient problem solving for interviews and performance.',
    modules: [
      { id: 'm1', name: 'Arrays & strings', status: 'upcoming', desc: 'The most common interview and performance-critical data structures.' },
      { id: 'm2', name: 'Trees & graphs', status: 'upcoming', desc: 'Modeling hierarchical and networked data, and traversing it efficiently.' },
      { id: 'm3', name: 'Dynamic programming', status: 'upcoming', desc: 'Solving problems by breaking them into overlapping subproblems.' },
    ],
    resources: [],
    relatedProject: 'p14',
  },
  'ai-ml-basics': {
    id: 'ai-ml-basics', name: 'Machine Learning Basics',
    description: 'Supervised and unsupervised learning fundamentals.',
    modules: [
      { id: 'm1', name: 'Regression', status: 'upcoming', desc: 'Predicting a continuous number from input features.' },
      { id: 'm2', name: 'Classification', status: 'upcoming', desc: 'Predicting which category something belongs to.' },
    ],
    resources: [],
    relatedProject: 'p15',
  },
  'ai-deep-learning': {
    id: 'ai-deep-learning', name: 'Deep Learning',
    description: 'Neural networks and modern architectures.',
    modules: [
      { id: 'm1', name: 'Neural network basics', status: 'upcoming', desc: 'Layers, weights, and activation functions — how a neural net actually computes.' },
      { id: 'm2', name: 'CNNs & transformers', status: 'upcoming', desc: 'Architectures specialized for images (CNNs) and sequences/language (transformers).' },
    ],
    resources: [],
    relatedProject: 'p16',
  },
  'ai-mlops': {
    id: 'ai-mlops', name: 'MLOps',
    description: 'Deploying and monitoring ML models in production.',
    modules: [
      { id: 'm1', name: 'Model serving', status: 'upcoming', desc: 'Getting a trained model behind an API so other systems can use it.' },
      { id: 'm2', name: 'Monitoring & drift', status: 'upcoming', desc: 'Watching a live model for when real-world data stops matching what it was trained on.' },
    ],
    resources: [],
    relatedProject: 'p17',
  },

  // ---- Data Science ----
  'ds-python': {
    id: 'ds-python', name: 'Python',
    description: 'The core language of the data science toolkit.',
    modules: [
      { id: 'm1', name: 'Syntax & data types', status: 'upcoming', desc: 'The Python fundamentals used across nearly every data science workflow.' },
      { id: 'm2', name: 'Working with libraries', status: 'upcoming', desc: 'Installing and using the data science ecosystem: NumPy, Pandas, and friends.' },
    ],
    resources: [],
    relatedProject: 'p13',
  },
  'ds-stats': {
    id: 'ds-stats', name: 'Statistics',
    description: 'The reasoning behind every data-driven claim.',
    modules: [
      { id: 'm1', name: 'Descriptive statistics', status: 'upcoming', desc: 'Summarizing a dataset with means, medians, and spread before doing anything else.' },
      { id: 'm2', name: 'Hypothesis testing', status: 'upcoming', desc: 'Checking whether a pattern in your data is likely real or just noise.' },
      { id: 'm3', name: 'Regression analysis', status: 'upcoming', desc: 'Modeling the relationship between a variable and one or more predictors.' },
    ],
    resources: [],
    relatedProject: 'p18',
  },
  'ds-wrangling': {
    id: 'ds-wrangling', name: 'Data Wrangling',
    description: 'Cleaning and reshaping messy real-world data.',
    modules: [
      { id: 'm1', name: 'Pandas fundamentals', status: 'upcoming', desc: 'Loading, filtering, and reshaping tabular data with Pandas.' },
      { id: 'm2', name: 'Handling missing data', status: 'upcoming', desc: 'Deciding whether to drop, fill, or flag the gaps in a real-world dataset.' },
    ],
    resources: [],
    relatedProject: 'p19',
  },
  'ds-viz': {
    id: 'ds-viz', name: 'Data Visualization',
    description: 'Communicating findings clearly with charts.',
    modules: [
      { id: 'm1', name: 'Matplotlib & Seaborn', status: 'upcoming', desc: "Python's core plotting libraries for turning data into charts." },
      { id: 'm2', name: 'Dashboard design', status: 'upcoming', desc: 'Laying out multiple charts so someone can actually act on them.' },
    ],
    resources: [],
    relatedProject: 'p20',
  },
  'ds-ml': {
    id: 'ds-ml', name: 'Machine Learning',
    description: 'Applying models to real datasets.',
    modules: [
      { id: 'm1', name: 'scikit-learn basics', status: 'upcoming', desc: "Training and evaluating standard ML models with Python's most common ML library." },
      { id: 'm2', name: 'Model evaluation', status: 'upcoming', desc: 'Measuring whether a model is actually good, not just whether it runs.' },
    ],
    resources: [],
    relatedProject: 'p15',
  },
  'ds-storytelling': {
    id: 'ds-storytelling', name: 'Data Storytelling',
    description: 'Turning analysis into decisions stakeholders act on.',
    modules: [
      { id: 'm1', name: 'Narrative structure', status: 'upcoming', desc: 'Framing an analysis so the point comes before the chart, not after.' },
      { id: 'm2', name: 'Presenting to stakeholders', status: 'upcoming', desc: "Communicating findings to people who don't want to see your code." },
    ],
    resources: [],
    relatedProject: 'p21',
  },
};

// Cosmetic module-based progress (flavor only — real completion is the
// separate completedSkillIds gamification state).
export function getModuleProgress(skill) {
  if (!skill.modules.length) return 0;
  const done = skill.modules.filter((m) => m.status === 'completed').length;
  return Math.round((done / skill.modules.length) * 100);
}

// Real per-path progress based on actual completed skills.
export function getPathStatuses(path, completedSkillIds) {
  let currentAssigned = false;
  return path.skillIds.map((id) => {
    const isCompleted = completedSkillIds.includes(id);
    let status;
    if (isCompleted) status = 'completed';
    else if (!currentAssigned) {
      status = 'current';
      currentAssigned = true;
    } else status = 'upcoming';
    return { id, status };
  });
}

export function getPathProgress(path, completedSkillIds) {
  const done = path.skillIds.filter((id) => completedSkillIds.includes(id)).length;
  return Math.round((done / path.skillIds.length) * 100);
}

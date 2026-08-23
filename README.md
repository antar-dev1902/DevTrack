# DevTrack

**Learn. Build. Compete. Grow.**

A developer learning and project-progression platform, built as a React evaluation project. DevTrack helps you see what to learn next, turn each skill into a real project, earn XP as you go, and discover hackathons — all in one place.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`). To build a production bundle:

```bash
npm run build
npm run preview
```

## Pages

- **Home** — the landing page: hero with a developer workspace illustration, the "Learn. Build. Compete. Grow." journey section, and the 5-step "How DevTrack works" walkthrough.
- **Learn & Roadmap** — the core feature. Pick a developer path, see the roadmap, click a skill to see its modules, resources, and related project — then mark it complete to earn **+50 XP**.
- **Projects** — search/filter your projects, add new ones (with a live task-list builder), and check off tasks on a project's detail page. Finishing every task on a project awards **+100 XP**, once.
- **HackerHub** — browse hackathons and opportunities with search and category filters.
- **Profile** — your XP total, XP breakdown (skills vs. projects), completed skills/projects, and a leaderboard comparing you against a handful of demo developers.

## XP system

XP is never stored as its own counter — it's derived every render from two sources of truth:

- `devtrack_skills` — the list of completed skill IDs. Each contributes 50 XP.
- `devtrack_projects` — the projects array. Each project with every task checked off contributes 100 XP.

Because XP is computed (`completedSkills.length * 50 + completedProjects.length * 100`) instead of incremented, there's no way to award it twice — marking a skill complete just adds its ID to a list that already excludes it once present, and a project's 100 XP is simply "is every task done," not a counter that could double-fire. The total is also mirrored to a third key, `devtrack_xp`, purely so it's inspectable in devtools; it's never read back in, so it can't itself drift out of sync.

## Notes on scope

This is a frontend-only build. Roadmap/project/hackathon/profile seed data lives in `src/data/`; real user state (completed skills, projects and their tasks) is held in React state lifted into `App.jsx` and persisted to `localStorage` via a small `useLocalStorage` hook, so progress survives a refresh but lives only in this browser — there's no backend, database, or real authentication. See the original PRD for the full list of what's intentionally out of scope for this evaluation (real APIs, team matching, XP levels/streaks, AI recommendations, etc.).

## Structure

```
src/
├── pages/        one file per route
├── components/   reusable UI (Navbar, RoadmapNode, ProjectCard, Leaderboard, ...)
├── data/         static roadmap/projects/hackathons/profile + leaderboard data
├── hooks/        useLocalStorage
└── styles/       global.css (design tokens + shared components) + one CSS file per page
```

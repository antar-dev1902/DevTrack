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

This is a frontend-only build. Roadmap/project/hackathon/profile seed data lives in `src/data/`. Redux Toolkit owns completed skills, projects, and task completion; React Context owns learning preferences and a learning goal. Both persist to localStorage, so progress survives a refresh but lives only in this browser. There is no backend, database, or real authentication.

## Context and Redux Toolkit

State has one owner for each responsibility:

| State | Owner | Used by |
| --- | --- | --- |
| Completed skills | Redux `progress` slice | Skills, Home, Profile |
| Projects and tasks | Redux `projects` slice | Projects, project details, Home, Profile |
| XP and completion counts | Redux selectors, calculated from completion | Home, Profile |
| Preferred developer path and learning goal | `LearningPreferencesProvider`, accessed with `useLearningPreferences()` | Home, Skills |
| Form drafts, validation errors, open dialogs, search text | Local `useState` | The component displaying the UI |
| Skill being viewed | Skills URL query, e.g. `/skills?skill=fe-react` | Skills and resume links |

`main.jsx` wraps the app with React-Redux's `Provider` and `LearningPreferencesProvider`. `App.jsx` handles routes; it no longer owns progress or project state.

Clicking **Mark Skill Complete** dispatches `skillCompleted(skillId)`. The progress reducer adds a known skill only once. Selectors calculate skill XP, project XP, and the total. Project actions are `projectAdded`, `projectUpdated`, `projectDeleted`, and `projectTaskToggled`. Redux DevTools is enabled in development.

Choosing a path calls Context's `setPreferredPath()`. Saving the validated learning-goal form calls `saveGoal()`. The goal and preferred path appear on Home as well as Skills. Goal completion is derived from Redux's completed skills; Context does not maintain a duplicate completion flag. `clearGoal()` removes the goal while preserving the preferred path.

The Redux migration reads the existing `devtrack_skills` and `devtrack_projects` keys without resetting valid saved progress, including empty arrays. `devtrack_xp` remains an inspectable mirror, never an XP source. Context uses a separate `devtrack_learning_preferences` key. State updates continue in memory when storage is blocked or full.

### Evaluation walkthrough

1. Choose Backend on Skills, then open Home: its learning card shows Backend.
2. Set a skill and a target date using **Set learning goal**. The same goal appears on both pages and survives a refresh.
3. Submit an empty or past target date to demonstrate field validation and accessible error feedback.
4. Complete the goal's skill: the goal displays **Completed**, and total XP increases by 50 on Home and Profile.
5. Create a project, edit it, and toggle its tasks. Completing every task contributes 100 XP; unchecking a task removes that contribution.
6. Inspect the named progress/project actions and state changes in Redux DevTools.

## Structure

```
src/
├── pages/        one file per route
├── components/   reusable UI (Navbar, RoadmapNode, ProjectCard, Leaderboard, ...)
├── data/         static roadmap/projects/hackathons/profile + leaderboard data
├── context/      learning preferences provider, consumer hook, goal validation
├── store/        Redux slices, selectors, store and localStorage persistence
├── hooks/        useLocalStorage
└── styles/       global.css (design tokens + shared components) + one CSS file per page
```

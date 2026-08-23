import { useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import LearnRoadmap from './pages/LearnRoadmap.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import HackerHub from './pages/HackerHub.jsx';
import HackathonDetails from './pages/HackathonDetails.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import initialProjects, { isProjectComplete } from './data/projectsData.js';
import { defaultCompletedSkillIds } from './data/roadmapData.js';

const SKILL_XP = 50;
const PROJECT_XP = 100;

// Bump this whenever roadmapData/projectsData's seed content or shape changes
// in a way old localStorage can't represent (e.g. the project catalog grows
// from 7 to 21 seed projects). Without this, a browser that already has
// `devtrack_projects` saved — even an empty array from earlier testing —
// keeps that stale value forever, since useLocalStorage always prefers
// whatever's already in storage over the new default. This runs once at
// module load, before any component reads localStorage, and wipes only the
// three derived-state keys so a version bump always shows the latest seed
// data on next load instead of silently keeping old/empty state.
const DATA_VERSION = '2';
if (typeof window !== 'undefined' && window.localStorage.getItem('devtrack_data_version') !== DATA_VERSION) {
  window.localStorage.removeItem('devtrack_skills');
  window.localStorage.removeItem('devtrack_projects');
  window.localStorage.removeItem('devtrack_xp');
  window.localStorage.setItem('devtrack_data_version', DATA_VERSION);
}

export default function App() {
  // Completion state is lifted to App so every page reads/writes the same
  // source of truth, and persisted to localStorage per PRD §40 (devtrack_skills,
  // devtrack_projects). XP is DERIVED from these two, never stored as the
  // source of truth itself — that's what makes "never award XP twice" free:
  // a skill/project either is or isn't in the completed set, no counter to drift.
  const [completedSkillIds, setCompletedSkillIds] = useLocalStorage('devtrack_skills', defaultCompletedSkillIds);
  const [projects, setProjects] = useLocalStorage('devtrack_projects', initialProjects);

  const completedProjectsCount = useMemo(
    () => projects.filter(isProjectComplete).length,
    [projects],
  );

  const skillXp = completedSkillIds.length * SKILL_XP;
  const projectXp = completedProjectsCount * PROJECT_XP;
  const totalXp = skillXp + projectXp;

  // Mirrored to its own key per PRD §40/§42 for inspectability — not read
  // back on load, so it can never itself become a source of double-counting.
  useEffect(() => {
    try {
      window.localStorage.setItem('devtrack_xp', JSON.stringify(totalXp));
    } catch {
      /* ignore */
    }
  }, [totalXp]);

  const completeSkill = (skillId) => {
    setCompletedSkillIds((prev) => (prev.includes(skillId) ? prev : [...prev, skillId]));
  };

  const addProject = (data) => {
    setProjects((prev) => [...prev, { ...data, id: `p${Date.now()}` }]);
  };

  const updateProject = (id, data) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProjectTask = (projectId, taskId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== projectId
          ? p
          : { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)) },
      ),
    );
  };

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home totalXp={totalXp} completedSkillCount={completedSkillIds.length} completedProjectsCount={completedProjectsCount} />}
          />
          <Route
            path="/skills"
            element={<LearnRoadmap completedSkillIds={completedSkillIds} onCompleteSkill={completeSkill} />}
          />
          <Route
            path="/projects"
            element={<Projects projects={projects} onAdd={addProject} onToggleTask={toggleProjectTask} />}
          />
          <Route
            path="/projects/:id"
            element={
              <ProjectDetails
                projects={projects}
                onUpdate={updateProject}
                onDelete={deleteProject}
                onToggleTask={toggleProjectTask}
              />
            }
          />
          <Route path="/hackerhub" element={<HackerHub />} />
          <Route path="/hackerhub/:id" element={<HackathonDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <Profile
                totalXp={totalXp}
                skillXp={skillXp}
                projectXp={projectXp}
                completedSkillCount={completedSkillIds.length}
                completedProjectsCount={completedProjectsCount}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

import { nanoid } from '@reduxjs/toolkit';
import initialProjects from '../data/projectsData.js';
import { defaultCompletedSkillIds, skills } from '../data/roadmapData.js';
import { selectTotalXp } from './selectors.js';

export function getBrowserStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readJson(storage, key) {
  try {
    const value = storage?.getItem(key);
    return value == null ? undefined : JSON.parse(value);
  } catch {
    return undefined;
  }
}

function restoreProjects(value) {
  if (!Array.isArray(value)) return structuredClone(initialProjects);

  const projectIds = new Set();
  return value.filter((project) => project && typeof project === 'object' && typeof project.name === 'string').map((project) => {
    let id = project.id;
    if (typeof id !== 'string' || !id || projectIds.has(id)) id = `p-${nanoid()}`;
    projectIds.add(id);

    const taskIds = new Set();
    const tasks = (Array.isArray(project.tasks) ? project.tasks : [])
      .filter((task) => task && typeof task.label === 'string')
      .map((task) => {
        let taskId = task.id;
        if (typeof taskId !== 'string' || !taskId || taskIds.has(taskId)) taskId = `task-${nanoid()}`;
        taskIds.add(taskId);
        return { ...task, id: taskId, completed: task.completed === true };
      });

    return {
      ...project,
      id,
      description: typeof project.description === 'string' ? project.description : '',
      technologies: Array.isArray(project.technologies) ? project.technologies.filter((item) => typeof item === 'string') : [],
      learningObjective: typeof project.learningObjective === 'string' ? project.learningObjective : '',
      nextStep: typeof project.nextStep === 'string' ? project.nextStep : '',
      tasks,
    };
  });
}

export function restoreState(storage) {
  const savedSkills = readJson(storage, 'devtrack_skills');
  const completedSkillIds = Array.isArray(savedSkills)
    ? [...new Set(savedSkills.filter((id) => typeof id === 'string' && Object.hasOwn(skills, id)))]
    : [...defaultCompletedSkillIds];

  return {
    progress: { completedSkillIds },
    projects: { items: restoreProjects(readJson(storage, 'devtrack_projects')) },
  };
}

export function persistState(state, storage) {
  if (!storage) return;
  try {
    // Retain the original keys and valid saved data when migrating to Redux.
    storage.setItem('devtrack_skills', JSON.stringify(state.progress.completedSkillIds));
    storage.setItem('devtrack_projects', JSON.stringify(state.projects.items));
    storage.setItem('devtrack_xp', JSON.stringify(selectTotalXp(state)));
    storage.setItem('devtrack_data_version', '2');
  } catch {
    // Progress still works in memory when browser storage is unavailable.
  }
}

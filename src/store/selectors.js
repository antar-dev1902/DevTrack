import { createSelector } from '@reduxjs/toolkit';
import { isProjectComplete } from '../data/projectsData.js';

export const SKILL_XP = 50;
export const PROJECT_XP = 100;

export const selectCompletedSkillIds = (state) => state.progress.completedSkillIds;
export const selectProjects = (state) => state.projects.items;
export const selectCompletedSkillCount = (state) => selectCompletedSkillIds(state).length;

export const selectCompletedProjectsCount = createSelector(
  [selectProjects],
  (projects) => projects.filter(isProjectComplete).length,
);

export const selectSkillXp = (state) => selectCompletedSkillCount(state) * SKILL_XP;
export const selectProjectXp = (state) => selectCompletedProjectsCount(state) * PROJECT_XP;

// XP is calculated from completion, never maintained as a second counter.
export const selectTotalXp = createSelector(
  [selectSkillXp, selectProjectXp],
  (skillXp, projectXp) => skillXp + projectXp,
);

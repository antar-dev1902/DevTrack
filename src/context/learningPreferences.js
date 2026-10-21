import { paths, skills } from '../data/roadmapData.js';

export const DEFAULT_PREFERENCES = { preferredPathId: paths[0].id, goal: null };

export function todayDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) &&
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` === value;
}

export function validateLearningGoal(goal, today = todayDate()) {
  const errors = {};
  if (!goal || !Object.hasOwn(skills, goal.skillId)) errors.skillId = 'Choose a skill for your goal.';
  if (!goal?.targetDate) errors.targetDate = 'Choose a target date.';
  else if (!isValidDate(goal.targetDate)) errors.targetDate = 'Enter a valid target date.';
  else if (goal.targetDate < today) errors.targetDate = 'Choose today or a future date.';
  return errors;
}

export function normalizePreferences(value) {
  const preferredPathId = paths.some((path) => path.id === value?.preferredPathId)
    ? value.preferredPathId : DEFAULT_PREFERENCES.preferredPathId;
  const savedGoal = value?.goal;
  const goalPath = paths.find((path) => path.skillIds.includes(savedGoal?.skillId));
  // Retain past goals so users can still review or edit them after their target date.
  const goal = goalPath && isValidDate(savedGoal.targetDate)
    ? { skillId: savedGoal.skillId, pathId: goalPath.id, targetDate: savedGoal.targetDate }
    : null;
  return { preferredPathId, goal };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppStore } from '../src/store/store.js';
import { skillCompleted } from '../src/store/progressSlice.js';
import { projectAdded, projectUpdated, projectDeleted, projectTaskToggled } from '../src/store/projectsSlice.js';
import { selectCompletedSkillIds, selectProjects, selectCompletedProjectsCount, selectTotalXp } from '../src/store/selectors.js';
import { normalizePreferences, validateLearningGoal } from '../src/context/learningPreferences.js';

function memoryStorage(values = {}) {
  const data = new Map(Object.entries(values));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
}

function emptyStorage() {
  return memoryStorage({ devtrack_skills: '[]', devtrack_projects: '[]' });
}

test('existing saved progress survives migration without being reset to seed data', () => {
  const goal = JSON.stringify({ preferredPathId: 'backend', goal: null });
  const storage = memoryStorage({
    devtrack_data_version: '1',
    devtrack_skills: JSON.stringify(['fe-react', 'be-auth']),
    devtrack_projects: JSON.stringify([{
      id: 'my-project', name: 'My saved project', description: 'Keep this',
      technologies: ['React'], learningObjective: 'State', nextStep: 'Review',
      tasks: [{ id: 'my-task', label: 'Build the UI', completed: true }],
    }]),
    devtrack_learning_preferences: goal,
  });
  const store = createAppStore(storage);
  assert.deepEqual(selectCompletedSkillIds(store.getState()), ['fe-react', 'be-auth']);
  assert.equal(selectProjects(store.getState())[0].id, 'my-project');
  assert.equal(selectTotalXp(store.getState()), 200);
  assert.equal(storage.getItem('devtrack_learning_preferences'), goal);
  assert.deepEqual(createAppStore(storage).getState(), store.getState());
});

test('empty saved arrays remain empty and fresh browsers retain the 700 XP seed', () => {
  assert.equal(selectTotalXp(createAppStore(emptyStorage()).getState()), 0);
  assert.equal(selectTotalXp(createAppStore(memoryStorage()).getState()), 700);
});

test('skill completion awards XP once and persists it under the original keys', () => {
  const storage = emptyStorage();
  const store = createAppStore(storage);
  store.dispatch(skillCompleted('fe-react'));
  store.dispatch(skillCompleted('fe-react'));
  store.dispatch(skillCompleted('unknown-skill'));
  assert.deepEqual(selectCompletedSkillIds(store.getState()), ['fe-react']);
  assert.equal(selectTotalXp(store.getState()), 50);
  assert.equal(JSON.parse(storage.getItem('devtrack_xp')), 50);
  assert.equal(selectTotalXp(createAppStore(storage).getState()), 50);
});

test('project CRUD and reversible task completion keep XP consistent through reloads', () => {
  const storage = emptyStorage();
  const store = createAppStore(storage);
  const action = projectAdded({
    name: 'Redux workflow', description: '', technologies: ['React'],
    learningObjective: '', nextStep: '',
    tasks: [{ id: 'a', label: 'Build', completed: false }, { id: 'b', label: 'Verify', completed: false }],
  });
  store.dispatch(action);
  const id = action.payload.id;
  store.dispatch(projectTaskToggled({ projectId: id, taskId: 'a' }));
  assert.equal(selectTotalXp(store.getState()), 0);
  store.dispatch(projectTaskToggled({ projectId: id, taskId: 'b' }));
  assert.equal(selectCompletedProjectsCount(store.getState()), 1);
  assert.equal(selectTotalXp(store.getState()), 100);
  store.dispatch(projectUpdated({ id, changes: { name: 'Updated workflow', id: 'wrong-id' } }));
  assert.equal(selectProjects(store.getState())[0].id, id);
  assert.equal(selectProjects(createAppStore(storage).getState())[0].name, 'Updated workflow');
  store.dispatch(projectTaskToggled({ projectId: id, taskId: 'b' }));
  assert.equal(selectTotalXp(store.getState()), 0);
  store.dispatch(projectDeleted(id));
  assert.equal(selectProjects(createAppStore(storage).getState()).length, 0);
});

test('legacy duplicate task IDs are repaired without losing either saved task', () => {
  const storage = memoryStorage({
    devtrack_skills: '[]',
    devtrack_projects: JSON.stringify([{
      id: 'legacy', name: 'Saved tasks',
      tasks: [{ id: 'new-1', label: 'First', completed: false }, { id: 'new-1', label: 'Second', completed: false }],
    }]),
  });
  const store = createAppStore(storage);
  const tasks = selectProjects(store.getState())[0].tasks;
  assert.equal(tasks.length, 2);
  assert.equal(new Set(tasks.map((task) => task.id)).size, 2);
  store.dispatch(projectTaskToggled({ projectId: 'legacy', taskId: tasks[1].id }));
  assert.deepEqual(selectProjects(store.getState())[0].tasks.map((task) => task.completed), [false, true]);
  assert.deepEqual(createAppStore(storage).getState(), store.getState());
});

test('malformed or unavailable storage does not prevent completing skills', () => {
  const corrupted = createAppStore(memoryStorage({ devtrack_skills: '{bad', devtrack_projects: 'null' }));
  assert.equal(selectTotalXp(corrupted.getState()), 700);
  const unavailable = createAppStore({
    getItem() { throw new Error('Storage blocked'); },
    setItem() { throw new Error('Storage blocked'); },
  });
  unavailable.dispatch(skillCompleted('fe-react'));
  assert.equal(selectTotalXp(unavailable.getState()), 750);
});

test('learning goals reject missing fields, invalid dates and past targets', () => {
  const today = '2026-10-21';
  assert.deepEqual(validateLearningGoal({}, today), { skillId: 'Choose a skill for your goal.', targetDate: 'Choose a target date.' });
  assert.ok(validateLearningGoal({ skillId: 'fe-react', targetDate: '2026-02-30' }, today).targetDate);
  assert.ok(validateLearningGoal({ skillId: 'fe-react', targetDate: '2026-10-20' }, today).targetDate);
  assert.deepEqual(validateLearningGoal({ skillId: 'fe-react', targetDate: today }, today), {});
});

test('Context preferences are distinct from completion and retain past learning goals', () => {
  assert.deepEqual(normalizePreferences(null), { preferredPathId: 'frontend', goal: null });
  assert.deepEqual(normalizePreferences({ preferredPathId: 'backend', goal: { skillId: 'fe-react', pathId: 'wrong', targetDate: '2026-01-01', completed: true } }), {
    preferredPathId: 'backend', goal: { skillId: 'fe-react', pathId: 'frontend', targetDate: '2026-01-01' },
  });
});

import { createSlice, nanoid } from '@reduxjs/toolkit';
import initialProjects from '../data/projectsData.js';

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { items: initialProjects },
  reducers: {
    projectAdded: {
      prepare(project) {
        return { payload: { ...project, id: `p-${nanoid()}` } };
      },
      reducer(state, action) {
        state.items.push(action.payload);
      },
    },
    projectUpdated(state, action) {
      const { id, changes } = action.payload;
      const project = state.items.find((item) => item.id === id);
      if (project) Object.assign(project, changes, { id });
    },
    projectDeleted(state, action) {
      state.items = state.items.filter((project) => project.id !== action.payload);
    },
    projectTaskToggled(state, action) {
      const { projectId, taskId } = action.payload;
      const project = state.items.find((item) => item.id === projectId);
      const task = project?.tasks.find((item) => item.id === taskId);
      if (task) task.completed = !task.completed;
    },
  },
});

export const { projectAdded, projectUpdated, projectDeleted, projectTaskToggled } = projectsSlice.actions;
export default projectsSlice.reducer;

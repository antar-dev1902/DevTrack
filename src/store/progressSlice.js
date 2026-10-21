import { createSlice } from '@reduxjs/toolkit';
import { defaultCompletedSkillIds, skills } from '../data/roadmapData.js';

const progressSlice = createSlice({
  name: 'progress',
  initialState: { completedSkillIds: [...defaultCompletedSkillIds] },
  reducers: {
    skillCompleted(state, action) {
      const skillId = action.payload;
      if (Object.hasOwn(skills, skillId) && !state.completedSkillIds.includes(skillId)) {
        state.completedSkillIds.push(skillId);
      }
    },
  },
});

export const { skillCompleted } = progressSlice.actions;
export default progressSlice.reducer;

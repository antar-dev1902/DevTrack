import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './progressSlice.js';
import projectsReducer from './projectsSlice.js';
import { getBrowserStorage, restoreState, persistState } from './persistence.js';

export function createAppStore(storage = getBrowserStorage()) {
  const store = configureStore({
    reducer: {
      progress: progressReducer,
      projects: projectsReducer,
    },
    preloadedState: restoreState(storage),
    devTools: import.meta.env?.DEV ?? true,
  });

  // Persistence is a side effect outside the reducers.
  store.subscribe(() => persistState(store.getState(), storage));
  persistState(store.getState(), storage);
  return store;
}

export const store = createAppStore();

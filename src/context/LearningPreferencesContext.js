import { createContext, useContext } from 'react';

export const LearningPreferencesContext = createContext(null);

export function useLearningPreferences() {
  const context = useContext(LearningPreferencesContext);
  if (!context) throw new Error('useLearningPreferences must be used inside LearningPreferencesProvider.');
  return context;
}

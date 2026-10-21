import { useCallback, useMemo } from 'react';
import { LearningPreferencesContext } from './LearningPreferencesContext.js';
import { DEFAULT_PREFERENCES, normalizePreferences, validateLearningGoal } from './learningPreferences.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { paths } from '../data/roadmapData.js';

export default function LearningPreferencesProvider({ children }) {
  const [savedPreferences, setPreferences] = useLocalStorage('devtrack_learning_preferences', DEFAULT_PREFERENCES);
  const preferences = useMemo(() => normalizePreferences(savedPreferences), [savedPreferences]);

  const setPreferredPath = useCallback((pathId) => {
    if (!paths.some((path) => path.id === pathId)) return;
    setPreferences((previous) => ({ ...normalizePreferences(previous), preferredPathId: pathId }));
  }, [setPreferences]);

  const saveGoal = useCallback((goal) => {
    if (Object.keys(validateLearningGoal(goal)).length) return false;
    const path = paths.find((item) => item.skillIds.includes(goal.skillId));
    setPreferences((previous) => ({
      ...normalizePreferences(previous),
      preferredPathId: path.id,
      goal: { skillId: goal.skillId, pathId: path.id, targetDate: goal.targetDate },
    }));
    return true;
  }, [setPreferences]);

  const clearGoal = useCallback(() => {
    setPreferences((previous) => ({ ...normalizePreferences(previous), goal: null }));
  }, [setPreferences]);

  const value = useMemo(() => ({ ...preferences, setPreferredPath, saveGoal, clearGoal }),
    [preferences, setPreferredPath, saveGoal, clearGoal]);

  return <LearningPreferencesContext.Provider value={value}>{children}</LearningPreferencesContext.Provider>;
}

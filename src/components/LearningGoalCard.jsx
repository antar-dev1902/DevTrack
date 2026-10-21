import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';
import LearningGoalForm from './LearningGoalForm.jsx';
import { useLearningPreferences } from '../context/LearningPreferencesContext.js';
import { todayDate } from '../context/learningPreferences.js';
import { skills } from '../data/roadmapData.js';
import { selectCompletedSkillIds } from '../store/selectors.js';
import '../styles/learningPreferences.css';

export default function LearningGoalCard({ suggestedSkillId }) {
  const { goal, saveGoal, clearGoal } = useLearningPreferences();
  const completedSkillIds = useSelector(selectCompletedSkillIds);
  const [editing, setEditing] = useState(false);
  const completed = goal && completedSkillIds.includes(goal.skillId);
  const overdue = goal && !completed && goal.targetDate < todayDate();

  const handleSave = (values) => {
    if (saveGoal(values)) setEditing(false);
  };

  return (
    <section className="learning-goal-card card" aria-label="Learning goal">
      <div className="learning-goal-heading">
        <span className="learning-goal-icon"><Icon name="target" size={18} /></span>
        <h2>Learning goal</h2>
        {goal && !editing && (
          <span className={`learning-goal-status ${completed ? 'is-complete' : overdue ? 'is-overdue' : ''}`}>
            {completed ? 'Completed' : overdue ? 'Target passed' : 'In progress'}
          </span>
        )}
      </div>

      {editing ? (
        <LearningGoalForm goal={goal} suggestedSkillId={suggestedSkillId} onSave={handleSave} onCancel={() => setEditing(false)} />
      ) : goal ? (
        <div className="learning-goal-summary">
          <div className="learning-goal-description" aria-live="polite">
            <Link to={`/skills?skill=${goal.skillId}`} className="learning-goal-skill">{skills[goal.skillId].name}</Link>
            <p>Target: <time dateTime={goal.targetDate}>{new Date(`${goal.targetDate}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time></p>
          </div>
          <div className="learning-goal-actions">
            <button type="button" className="btn btn-secondary btn-small" onClick={() => setEditing(true)}>Edit goal</button>
            <button type="button" className="learning-goal-clear" onClick={clearGoal}>Clear goal</button>
          </div>
        </div>
      ) : (
        <div className="learning-goal-summary">
          <p>Pick a skill and a date to keep your learning focused.</p>
          <button type="button" className="btn btn-secondary btn-small" onClick={() => setEditing(true)}>Set learning goal</button>
        </div>
      )}
    </section>
  );
}

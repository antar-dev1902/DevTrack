import { useId, useState } from 'react';
import FormField from './FormField.jsx';
import { paths, skills } from '../data/roadmapData.js';
import { todayDate, validateLearningGoal } from '../context/learningPreferences.js';

export default function LearningGoalForm({ goal, suggestedSkillId, onSave, onCancel }) {
  const formId = useId();
  const skillId = `${formId}-skill`;
  const dateId = `${formId}-date`;
  const [values, setValues] = useState({
    skillId: goal?.skillId || suggestedSkillId || '',
    targetDate: goal?.targetDate || '',
  });
  const [errors, setErrors] = useState({});

  const update = (event) => {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: validateLearningGoal(next)[name] }));
  };

  const validateField = (event) => {
    const { name } = event.target;
    setErrors((previous) => ({ ...previous, [name]: validateLearningGoal(values)[name] }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateLearningGoal(values);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      event.currentTarget.elements.namedItem(firstError)?.focus();
      return;
    }
    onSave(values);
  };

  return (
    <form className="learning-goal-form" noValidate onSubmit={submit}>
      <div className="learning-goal-fields">
        <FormField id={skillId} label="Skill" error={errors.skillId}>
          <select
            id={skillId}
            name="skillId"
            className="input"
            value={values.skillId}
            onChange={update}
            onBlur={validateField}
            aria-invalid={!!errors.skillId}
            aria-describedby={errors.skillId ? `${skillId}-error` : undefined}
            required
          >
            <option value="">Choose a skill</option>
            {paths.map((path) => (
              <optgroup key={path.id} label={path.name}>
                {path.skillIds.map((id) => <option key={id} value={id}>{skills[id].name}</option>)}
              </optgroup>
            ))}
          </select>
        </FormField>
        <FormField id={dateId} label="Target date" error={errors.targetDate}>
          <input
            id={dateId}
            name="targetDate"
            type="date"
            className="input"
            min={todayDate()}
            value={values.targetDate}
            onChange={update}
            onBlur={validateField}
            aria-invalid={!!errors.targetDate}
            aria-describedby={errors.targetDate ? `${dateId}-error` : undefined}
            required
          />
        </FormField>
      </div>
      <div className="learning-goal-form-actions">
        <button type="button" className="btn btn-secondary btn-small" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-small">Save goal</button>
      </div>
    </form>
  );
}

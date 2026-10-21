import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';
import LearningGoalCard from './LearningGoalCard.jsx';
import { useLearningPreferences } from '../context/LearningPreferencesContext.js';
import { paths, skills, getPathStatuses } from '../data/roadmapData.js';
import { selectCompletedSkillIds, selectCompletedSkillCount, selectCompletedProjectsCount, selectTotalXp } from '../store/selectors.js';
import '../styles/learningPreferences.css';

export default function ContinueLearning() {
  const { preferredPathId } = useLearningPreferences();
  const completedSkillIds = useSelector(selectCompletedSkillIds);
  const completedSkillCount = useSelector(selectCompletedSkillCount);
  const completedProjectsCount = useSelector(selectCompletedProjectsCount);
  const totalXp = useSelector(selectTotalXp);
  const path = paths.find((item) => item.id === preferredPathId);
  const current = getPathStatuses(path, completedSkillIds).find((skill) => skill.status === 'current');
  const nextSkill = skills[current?.id || path.skillIds[0]];

  return (
    <section className="continue-learning-section">
      <div className="container continue-learning-grid">
        <article className="continue-learning-card card">
          <span className="continue-learning-eyebrow"><Icon name="compass" size={14} /> Your learning</span>
          <h2>{path.name}</h2>
          <p>{current ? `Next up: ${nextSkill.name}. Pick up where you left off.` : 'You’ve completed this path. Revisit a skill or explore a new one.'}</p>
          <dl className="continue-learning-stats">
            <div><dt>Total XP</dt><dd>{totalXp.toLocaleString()}</dd></div>
            <div><dt>Skills completed</dt><dd>{completedSkillCount}</dd></div>
            <div><dt>Projects completed</dt><dd>{completedProjectsCount}</dd></div>
          </dl>
          <Link to={`/skills?skill=${nextSkill.id}`} className="btn btn-primary btn-small">
            {current ? `Continue with ${nextSkill.name}` : 'Review your path'}
            <Icon name="arrowRight" size={15} />
          </Link>
        </article>
        <LearningGoalCard suggestedSkillId={nextSkill.id} />
      </div>
    </section>
  );
}

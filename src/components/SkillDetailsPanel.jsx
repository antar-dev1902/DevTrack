import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';
import ProgressBar from './ProgressBar.jsx';
import { projectNameLookup } from '../data/projectsData.js';
import { getModuleProgress } from '../data/roadmapData.js';

const statusIcon = {
  completed: 'check',
  current: 'arrowRight',
  upcoming: 'lock',
};

export default function SkillDetailsPanel({ skill, isCompleted, onComplete }) {
  if (!skill) {
    return (
      <div className="skill-panel card skill-panel-empty">
        <Icon name="compass" size={24} />
        <p>Select a skill on the roadmap to see its learning details.</p>
      </div>
    );
  }

  const moduleProgress = getModuleProgress(skill);

  return (
    <div className="skill-panel card">
      <div className="skill-panel-header">
        <div>
          <span className={`badge ${isCompleted ? 'badge-success' : 'badge-accent'}`}>
            {isCompleted ? 'Completed' : 'In progress'}
          </span>
          <h3 className="skill-panel-title">{skill.name}</h3>
        </div>
      </div>

      <p className="skill-panel-desc">{skill.description}</p>

      <div className="skill-panel-progress">
        <span>Progress</span>
        <ProgressBar value={moduleProgress} showLabel />
      </div>

      <div className="skill-panel-modules">
        <h4>Learning modules</h4>
        <ul className="module-list">
          {skill.modules.map((m) => (
            <li key={m.id} className={`module-item module-item-${m.status}`}>
              <span className="module-item-row">
                <Icon name={statusIcon[m.status]} size={14} />
                <span className="module-item-name">{m.name}</span>
              </span>
              {m.desc && <p className="module-item-desc">{m.desc}</p>}
            </li>
          ))}
        </ul>
      </div>

      {skill.resources.length > 0 && (
        <div className="skill-panel-resources">
          <h4>Recommended resources</h4>
          <ul>
            {skill.resources.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.label}
                  <Icon name="external" size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {skill.relatedProject && (
        <Link to={`/projects/${skill.relatedProject}`} className="skill-panel-project">
          <Icon name="code" size={15} />
          Related project: {projectNameLookup[skill.relatedProject]}
          <Icon name="arrowRight" size={14} />
        </Link>
      )}

      <div className="skill-panel-complete">
        {isCompleted ? (
          <div className="skill-complete-badge">
            <Icon name="check" size={15} />
            Completed
            <span className="xp-pill">+{50} XP</span>
          </div>
        ) : (
          <button type="button" className="btn btn-primary skill-complete-btn" onClick={onComplete}>
            Mark Skill Complete
            <span className="xp-pill xp-pill-inverse">+50 XP</span>
          </button>
        )}
      </div>
    </div>
  );
}

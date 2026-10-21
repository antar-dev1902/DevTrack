import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';
import { projectNameLookup } from '../data/projectsData.js';

export default function SkillDetailsPanel({ skill, skillNumber, totalSkills, isCompleted, onComplete }) {
  if (!skill) {
    return <section className="skill-panel card"><p>Select a skill to see what you’ll learn.</p></section>;
  }

  return (
    <section className="skill-panel card" aria-labelledby="skill-panel-title">
      <header className="skill-panel-header">
        <span className="skill-panel-eyebrow">Skill {String(skillNumber).padStart(2, '0')} of {totalSkills}</span>
        <h2 id="skill-panel-title">{skill.name}</h2>
        <p>{skill.description}</p>
      </header>

      <div className="skill-panel-section">
        <h3>What you’ll learn</h3>
        <ul className="module-list">
          {skill.modules.map((module) => (
            <li key={module.id} className="module-item">
              <h4>{module.name}</h4>
              {module.desc && <p>{module.desc}</p>}
            </li>
          ))}
        </ul>
      </div>

      {skill.resources.length > 0 && (
        <div className="skill-panel-section">
          <h3>Learning resources</h3>
          <ul className="skill-resource-list">
            {skill.resources.map((resource) => (
              <li key={resource.url}>
                <a href={resource.url} target="_blank" rel="noreferrer" className="skill-resource-link">
                  <span>{resource.label}</span>
                  <Icon name="external" size={14} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {skill.relatedProject && (
        <div className="skill-panel-section">
          <h3>Suggested project</h3>
          <Link to={`/projects/${skill.relatedProject}`} className="skill-panel-project">
            <span className="skill-project-icon"><Icon name="code" size={18} /></span>
            <span>{projectNameLookup[skill.relatedProject]}</span>
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      )}

      <div className="skill-panel-complete">
        {isCompleted ? (
          <div className="skill-complete-badge" role="status">
            <Icon name="check" size={18} />
            <span>Skill completed</span>
            <strong>50 XP earned</strong>
          </div>
        ) : (
          <button type="button" className="btn btn-primary skill-complete-btn" onClick={onComplete}>
            Mark Skill Complete
            <span>+50 XP</span>
          </button>
        )}
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';
import ProgressBar from './ProgressBar.jsx';
import { getProjectProgress, getProjectStatus } from '../data/projectsData.js';

const statusMeta = {
  'Not Started': { dot: 'status-dot-neutral', label: 'Not Started' },
  'In Progress': { dot: 'status-dot-progress', label: 'In Progress' },
  Completed: { dot: 'status-dot-complete', label: 'Completed' },
};

export default function ProjectCard({ project }) {
  const progress = getProjectProgress(project);
  const status = getProjectStatus(project);
  const meta = statusMeta[status];
  const isComplete = status === 'Completed';
  const isNotStarted = status === 'Not Started';

  return (
    <div className="project-card card card-hover fade-up">
      <h3 className="project-card-title">{project.name}</h3>

      <p className="project-card-desc">{project.description}</p>

      <div className="project-card-tech">
        {project.technologies.map((t) => (
          <span key={t} className="badge">{t}</span>
        ))}
      </div>

      <div className="project-card-progress">
        <span className="project-card-progress-label">Progress</span>
        <ProgressBar value={progress} showLabel accent={isComplete ? 'success' : 'default'} />
      </div>

      <div className={`project-status project-status-${isComplete ? 'complete' : isNotStarted ? 'neutral' : 'progress'}`}>
        <span className={`status-dot ${meta.dot}`} aria-hidden="true">
          {isComplete && <Icon name="check" size={10} />}
        </span>
        {meta.label}
        {isComplete && <span className="project-card-xp">+100 XP</span>}
      </div>

      {!isNotStarted && (
        <div className="project-card-meta">
          <div>
            <span className="project-card-meta-label">
              <Icon name="book" size={13} />
              Learning
            </span>
            <span>{project.learningObjective}</span>
          </div>
          <div>
            <span className="project-card-meta-label">
              <Icon name="target" size={13} />
              Next
            </span>
            <span>{project.nextStep}</span>
          </div>
        </div>
      )}

      <Link to={`/projects/${project.id}`} className="btn btn-secondary btn-small project-card-cta">
        {isNotStarted ? 'Start Project' : 'View Project'}
        <Icon name="arrowRight" size={14} />
      </Link>
    </div>
  );
}

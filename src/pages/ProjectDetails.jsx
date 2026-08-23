import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ProjectModal from '../components/ProjectModal.jsx';
import ProjectTask from '../components/ProjectTask.jsx';
import { getProjectProgress, getProjectStatus, isProjectComplete } from '../data/projectsData.js';
import '../styles/projects.css';

const statusClass = {
  Completed: 'badge-success',
  'In Progress': 'badge-accent',
  'Not Started': '',
};

export default function ProjectDetails({ projects, onUpdate, onDelete, onToggleTask }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="container section">
        <div className="empty-state card">
          <Icon name="search" size={22} />
          <p>This project doesn't exist (maybe it was deleted).</p>
          <Link to="/projects" className="btn btn-secondary btn-small">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const progress = getProjectProgress(project);
  const status = getProjectStatus(project);
  const complete = isProjectComplete(project);
  const doneCount = project.tasks.filter((t) => t.completed).length;
  const currentTask = project.tasks.find((t) => !t.completed);

  const handleSave = (data) => {
    onUpdate(project.id, data);
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(project.id);
    navigate('/projects');
  };

  return (
    <div className="project-details-page section">
      <div className="container">
        <Link to="/projects" className="back-link">
          <Icon name="arrowRight" size={14} className="back-link-icon" />
          Back to Projects
        </Link>

        <div className="project-details-header">
          <div>
            <span className={`badge ${statusClass[status] || ''}`}>{status}</span>
            <h2 className="project-details-title">{project.name}</h2>
          </div>
          <div className="project-details-actions">
            <button type="button" className="btn btn-secondary btn-small" onClick={() => setEditing(true)}>
              <Icon name="edit" size={14} />
              Edit Project
            </button>
            <button type="button" className="btn btn-danger btn-small" onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" size={14} />
              Delete Project
            </button>
          </div>
        </div>

        {complete && (
          <div className="project-complete-banner">
            <Icon name="check" size={16} />
            Project Completed
            <span className="xp-pill">+100 XP</span>
          </div>
        )}

        <div className="project-details-grid">
          <div className="project-details-main card">
            <h4>Description</h4>
            <p>{project.description}</p>

            <h4>Technologies</h4>
            <div className="project-card-tech">
              {project.technologies.map((t) => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>

            <h4>Project Tasks</h4>
            {project.tasks.length > 0 ? (
              <ul className="task-list-interactive">
                {project.tasks.map((t) => (
                  <ProjectTask key={t.id} task={t} onToggle={() => onToggleTask(project.id, t.id)} />
                ))}
              </ul>
            ) : (
              <p className="text-faint">No tasks yet — edit this project to add some.</p>
            )}

            <h4>Current task</h4>
            <p>{currentTask ? currentTask.label : complete ? 'All tasks complete' : '—'}</p>

            <h4>Next step</h4>
            <p>{project.nextStep}</p>
          </div>

          <div className="project-details-side">
            <div className="card project-details-stat-card">
              <h4>Project Progress</h4>
              <ProgressBar value={progress} showLabel size="sm" accent={complete ? 'success' : 'default'} />
              <p className="project-details-progress-count">
                {doneCount} / {project.tasks.length} tasks completed
              </p>
              <p className="project-details-status-line">
                Status: <strong>{status}</strong>
              </p>
            </div>

            <div className="card project-details-stat-card">
              <h4>Learning objective</h4>
              {project.learningObjective ? (
                <span className="badge badge-accent">{project.learningObjective}</span>
              ) : (
                <span className="text-faint">Not set</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <ProjectModal project={project} onClose={() => setEditing(false)} onSave={handleSave} />
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(false)}>
          <div className="modal card modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Project?</h3>
            <p>
              Are you sure you want to delete <strong>&ldquo;{project.name}&rdquo;</strong>? This can&apos;t be undone.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                <Icon name="trash" size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

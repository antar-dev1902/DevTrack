import { useState } from 'react';
import Icon from './icons/ImageIcon.jsx';

const emptyForm = {
  name: '',
  description: '',
  technologies: '',
  learningObjective: '',
  nextStep: '',
};

let taskKeyCounter = 0;
function nextTaskId() {
  taskKeyCounter += 1;
  return `new-${taskKeyCounter}`;
}

export default function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(
    project
      ? { ...project, technologies: project.technologies.join(', ') }
      : emptyForm,
  );
  const [taskList, setTaskList] = useState(project ? project.tasks : []);
  const [newTaskLabel, setNewTaskLabel] = useState('');

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addTask = () => {
    const label = newTaskLabel.trim();
    if (!label) return;
    setTaskList((prev) => [...prev, { id: nextTaskId(), label, completed: false }]);
    setNewTaskLabel('');
  };

  const removeTask = (id) => {
    setTaskList((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTaskList((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    onSave({
      ...form,
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      tasks: taskList,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{project ? 'Edit Project' : 'Add Project'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="pm-name">Project name</label>
            <input id="pm-name" className="input" value={form.name} onChange={update('name')} required />
          </div>

          <div className="form-field">
            <label htmlFor="pm-desc">Description</label>
            <textarea
              id="pm-desc"
              className="input textarea"
              value={form.description}
              onChange={update('description')}
              rows={3}
            />
          </div>

          <div className="form-field">
            <label htmlFor="pm-tech">Technologies (comma separated)</label>
            <input
              id="pm-tech"
              className="input"
              value={form.technologies}
              onChange={update('technologies')}
              placeholder="React, API, CSS"
            />
          </div>

          <div className="form-field">
            <label htmlFor="pm-learning">Learning objective</label>
            <input
              id="pm-learning"
              className="input"
              value={form.learningObjective}
              onChange={update('learningObjective')}
              placeholder="React state & API integration"
            />
          </div>

          <div className="form-field">
            <label htmlFor="pm-next">Next step</label>
            <input id="pm-next" className="input" value={form.nextStep} onChange={update('nextStep')} />
          </div>

          <div className="form-field">
            <label>Project tasks</label>
            <ul className="modal-task-list">
              {taskList.map((t) => (
                <li key={t.id} className="modal-task-row">
                  <button
                    type="button"
                    className={`project-task-toggle ${t.completed ? 'project-task-toggle-done' : ''}`}
                    onClick={() => toggleTask(t.id)}
                    aria-pressed={t.completed}
                  >
                    {t.completed && <Icon name="check" size={12} />}
                  </button>
                  <span className={t.completed ? 'modal-task-label-done' : ''}>{t.label}</span>
                  <button
                    type="button"
                    className="modal-task-remove"
                    onClick={() => removeTask(t.id)}
                    aria-label={`Remove task ${t.label}`}
                  >
                    <Icon name="x" size={13} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="modal-task-add">
              <input
                className="input"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="Add a task..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTask();
                  }
                }}
              />
              <button type="button" className="btn btn-secondary btn-small" onClick={addTask}>
                <Icon name="plus" size={14} />
                Add
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

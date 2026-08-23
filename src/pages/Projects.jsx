import { useState, useMemo } from 'react';
import Icon from '../components/icons/ImageIcon.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectModal from '../components/ProjectModal.jsx';
import { getProjectStatus } from '../data/projectsData.js';
import '../styles/projects.css';

const filterOptions = [
  { value: 'All', label: 'All' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

export default function Projects({ projects, onAdd }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = status === 'All' || getProjectStatus(p) === status;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [projects, query, status]);

  const handleSave = (data) => {
    onAdd(data);
    setModalOpen(false);
  };

  return (
    <div className="projects-page section">
      <div className="container">
        <div className="projects-header">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <span className="eyebrow">
              <Icon name="code" size={14} />
              Projects
            </span>
            <h2>Build what you learn.</h2>
            <p>Turn your skills into practical projects and track your progress as you build.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Icon name="plus" size={16} />
            Add Project
          </button>
        </div>

        {projects.length > 0 && (
          <div className="projects-toolbar">
            <SearchBar value={query} onChange={setQuery} placeholder="Search projects..." />
            <FilterBar options={filterOptions} active={status} onChange={setStatus} />
          </div>
        )}

        {projects.length === 0 ? (
          <div className="empty-state card">
            <span className="empty-state-emoji" aria-hidden="true">🛠️</span>
            <h3>No projects yet</h3>
            <p>Start building your first project and put your skills into practice.</p>
            <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Icon name="plus" size={16} />
              Add Project
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="projects-grid">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <Icon name="search" size={22} />
            <p>No projects match your search or filter.</p>
          </div>
        )}
      </div>

      {modalOpen && <ProjectModal onClose={() => setModalOpen(false)} onSave={handleSave} />}
    </div>
  );
}

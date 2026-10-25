import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProjects } from '../store/selectors.js';
import { projectAdded } from '../store/projectsSlice.js';
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

const ITEMS_PER_PAGE = 6;

export default function Projects() {
  const projects = useSelector(selectProjects);
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedProjects = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, safeCurrentPage]);

  const handleQueryChange = (val) => {
    setQuery(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setCurrentPage(1);
  };

  const handleSave = (data) => {
    dispatch(projectAdded(data));
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
            <SearchBar value={query} onChange={handleQueryChange} placeholder="Search projects..." />
            <FilterBar options={filterOptions} active={status} onChange={handleStatusChange} />
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
          <>
            <div className="projects-grid">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {totalPages > 1 && (
              <div
                className="pagination"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: 'var(--sp-7)',
                  flexWrap: 'wrap',
                }}
                aria-label="Projects pagination"
              >
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  style={{
                    opacity: safeCurrentPage === 1 ? 0.45 : 1,
                    cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="Previous page"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`btn btn-small ${pageNum === safeCurrentPage ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{ minWidth: '38px', padding: '8px 14px' }}
                    aria-current={pageNum === safeCurrentPage ? 'page' : undefined}
                    aria-label={`Page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  style={{
                    opacity: safeCurrentPage === totalPages ? 0.45 : 1,
                    cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
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

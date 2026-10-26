import { useState, useMemo } from 'react';
import Icon from '../components/icons/ImageIcon.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import HackathonCard from '../components/HackathonCard.jsx';
import hackathonsData from '../data/hackathonsData.js';
import { getHackathonStatus } from '../utils/hackathonUtils.js';
import '../styles/hackerHub.css';

const categories = ['All', 'Upcoming', 'Expired', 'AI/ML', 'Web', 'Hardware', 'Open Source', 'Beginner Friendly', 'Online'];

export default function HackerHub() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return hackathonsData.filter((h) => {
      const status = getHackathonStatus(h);

      let matchesCategory = true;
      if (category === 'Upcoming') {
        matchesCategory = status === 'upcoming';
      } else if (category === 'Expired') {
        matchesCategory = status === 'expired';
      } else if (category !== 'All') {
        matchesCategory = Array.isArray(h.categories) && h.categories.includes(category);
      }

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        h.name.toLowerCase().includes(q) ||
        (Array.isArray(h.themes) && h.themes.some((t) => t.toLowerCase().includes(q))) ||
        (Array.isArray(h.categories) && h.categories.some((c) => c.toLowerCase().includes(q))) ||
        (h.description && h.description.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="hackerhub-page section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">
            <Icon name="trophy" size={14} />
            HackerHub
          </span>
          <h2>Find your next challenge.</h2>
          <p>Hackathons, competitions, and developer opportunities worth putting on your calendar.</p>
        </div>

        <div className="projects-toolbar">
          <SearchBar value={query} onChange={setQuery} placeholder="Search hackathons or themes..." />
          <FilterBar
            options={categories.map((c) => ({ value: c, label: c }))}
            active={category}
            onChange={setCategory}
          />
        </div>

        {filtered.length > 0 ? (
          <div className="hackathon-grid">
            {filtered.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <Icon name="search" size={22} />
            <p>No hackathons match your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

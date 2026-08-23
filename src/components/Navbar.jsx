import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/hackerhub', label: 'HackerHub' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <span className="navbar-brand-mark">
            <Icon name="code" size={18} />
          </span>
          DevTrack
        </NavLink>

        <nav className={`navbar-links ${open ? 'navbar-links-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            className="navbar-login-link"
            onClick={() => setOpen(false)}
          >
            <Icon name="lock" size={14} />
            Log In
          </NavLink>
        </nav>

        <button
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'x' : 'menu'} size={20} />
        </button>
      </div>
    </header>
  );
}

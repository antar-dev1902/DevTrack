import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';
import { useAuth } from '../context/AuthContext.js';

const links = [
  { to: '/', label: 'Home' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/hackerhub', label: 'HackerHub' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

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

          {isAuthenticated ? (
            <button
              type="button"
              className="navbar-login-link"
              onClick={handleLogout}
              style={{ border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              <Icon name="lock" size={14} />
              Log Out
            </button>
          ) : (
            <NavLink
              to="/login"
              className="navbar-login-link"
              onClick={() => setOpen(false)}
            >
              <Icon name="lock" size={14} />
              Log In
            </NavLink>
          )}
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

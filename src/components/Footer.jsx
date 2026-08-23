import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="navbar-brand-mark">
            <Icon name="code" size={16} />
          </span>
          <div>
            <div className="footer-title">DevTrack</div>
            <div className="footer-tagline">Learn. Build. Compete. Grow.</div>
          </div>
        </div>

        <nav className="footer-links">
          <Link to="/skills">Skills</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/hackerhub">HackerHub</Link>
          <Link to="/profile">Profile</Link>
        </nav>

        <div className="footer-copy">© {new Date().getFullYear()} DevTrack. Built for developers, by developers.</div>
      </div>
    </footer>
  );
}

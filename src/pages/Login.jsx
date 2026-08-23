import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import '../styles/login.css';

// DevTrack has no real backend/auth per project scope — there is no server
// to authenticate against, so this form doesn't (and can't honestly pretend
// to) validate credentials. What it CAN do is give the existing single
// implicit-user experience (Profile/XP/Projects, all already working with
// no login gate) a real entry point: submitting takes you into the app at
// /profile, same as it already works today, just via a proper login screen
// instead of a bare navbar link.
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter an email and password to continue.');
      return;
    }
    setError('');
    navigate('/profile');
  };

  return (
    <div className="login-page section">
      <div className="container login-container">
        <div className="card login-card fade-up">
          <span className="eyebrow">
            <Icon name="lock" size={14} />
            Welcome back
          </span>
          <h2 className="login-title">Log in to DevTrack</h2>
          <p className="login-subtitle">
            Track your skills, projects, and XP in one place. This is a demo login for the
            evaluation build — no account or password is actually checked.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn btn-primary login-submit">
              Log In
              <Icon name="arrowRight" size={15} />
            </button>
          </form>

          <p className="login-footnote">
            Don't have an account? <Link to="/signup" className="login-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

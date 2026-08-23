import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import '../styles/login.css';

// Same no-backend scope as Login: nothing is actually registered anywhere.
// This exists so the "Don't have an account? Sign up" flow goes somewhere
// real instead of looping back to the login form. Submitting does basic
// client-side validation (name/email/password present, passwords match)
// then drops you into the app at /profile, same landing point as Login.
export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Fill in your name, email, and password to continue.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
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
            <Icon name="rocket" size={14} />
            Get started
          </span>
          <h2 className="login-title">Create your DevTrack account</h2>
          <p className="login-subtitle">
            Start tracking skills, projects, and XP. This is a demo signup for the evaluation
            build — nothing is actually stored on a server or sent anywhere.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                className="input"
                placeholder="Jordan Lee"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="signup-confirm-password">Confirm password</label>
              <input
                id="signup-confirm-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn btn-primary login-submit">
              Create Account
              <Icon name="arrowRight" size={15} />
            </button>
          </form>

          <p className="login-footnote">
            Already have an account? <Link to="/login" className="login-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import { getProfileByIdOrEmail } from '../data/profileData.js';
import '../styles/login.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const user = getProfileByIdOrEmail(email.trim());
    try {
      localStorage.setItem('devtrack_current_user', JSON.stringify(user));
      localStorage.setItem('devtrack_current_user_id', user.id);
    } catch {
      // storage unavailable
    }

    navigate(`/profile?userId=${user.id}`);
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
            Track your skills, projects, and XP in one place. Enter your email and password to access your personalized profile.
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                autoComplete="email"
              />
              {errors.email && (
                <p className="login-error" style={{ marginTop: '4px', marginBottom: 0 }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="login-error" style={{ marginTop: '4px', marginBottom: 0 }}>
                  {errors.password}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary login-submit">
              Log In
              <Icon name="arrowRight" size={15} />
            </button>
          </form>

          <p className="login-footnote">
            Don&apos;t have an account? <Link to="/signup" className="login-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

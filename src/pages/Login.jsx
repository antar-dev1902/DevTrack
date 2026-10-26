import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import { useAuth } from '../context/AuthContext.js';
import { EMAIL_REGEX } from '../services/authService.js';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await login({ email: email.trim(), password });
      if (result.success && result.user) {
        navigate(`/profile?userId=${result.user.id}`);
      } else {
        setErrors(result.errors || { form: 'Authentication failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ form: err.message || 'An error occurred during login. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
            {errors.form && (
              <p className="login-error" style={{ marginBottom: '12px' }}>
                {errors.form}
              </p>
            )}

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
                  if (errors.email || errors.form) setErrors((prev) => ({ ...prev, email: '', form: '' }));
                }}
                autoComplete="email"
                disabled={isSubmitting}
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
                  if (errors.password || errors.form) setErrors((prev) => ({ ...prev, password: '', form: '' }));
                }}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="login-error" style={{ marginTop: '4px', marginBottom: 0 }}>
                  {errors.password}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary login-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging In...' : 'Log In'}
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

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import '../styles/login.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Full name is required.';
    }

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

    if (!confirmPassword.trim()) {
      errs.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
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

    const formattedName = name.trim();
    const initials = formattedName.charAt(0).toUpperCase() || 'U';
    const userId = `u-${Date.now()}`;
    const newUser = {
      id: userId,
      email: email.trim(),
      name: formattedName,
      developerPath: 'Frontend Developer',
      bio: `${formattedName}’s developer journey — learning and building on DevTrack.`,
      avatarInitials: initials,
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      hackathonsCount: 0,
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('devtrack_users') || '[]');
      existing.push(newUser);
      localStorage.setItem('devtrack_users', JSON.stringify(existing));
      localStorage.setItem('devtrack_current_user', JSON.stringify(newUser));
      localStorage.setItem('devtrack_current_user_id', newUser.id);
    } catch {
      // storage unavailable
    }

    navigate(`/profile?userId=${newUser.id}`);
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
            Start tracking skills, projects, and XP. Fill in your details below to set up your personal profile.
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                className="input"
                placeholder="Jordan Lee"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                autoComplete="name"
              />
              {errors.name && (
                <p className="login-error" style={{ marginTop: '4px', marginBottom: 0 }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="login-error" style={{ marginTop: '4px', marginBottom: 0 }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="signup-confirm-password">Confirm password</label>
              <input
                id="signup-confirm-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="login-error" style={{ marginTop: '4px', marginBottom: 0 }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

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

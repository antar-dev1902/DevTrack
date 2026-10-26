import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import { useAuth } from '../context/AuthContext.js';
import { EMAIL_REGEX } from '../services/authService.js';
import '../styles/login.css';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const result = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      if (result.success && result.user) {
        navigate(`/profile?userId=${result.user.id}`);
      } else {
        setErrors(result.errors || { form: 'Registration failed. Please check your information.' });
      }
    } catch (err) {
      setErrors({ form: err.message || 'An error occurred during registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
            {errors.form && (
              <p className="login-error" style={{ marginBottom: '12px' }}>
                {errors.form}
              </p>
            )}

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
                  if (errors.name || errors.form) setErrors((prev) => ({ ...prev, name: '', form: '' }));
                }}
                autoComplete="name"
                disabled={isSubmitting}
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
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password || errors.form) setErrors((prev) => ({ ...prev, password: '', form: '' }));
                }}
                autoComplete="new-password"
                disabled={isSubmitting}
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
                  if (errors.confirmPassword || errors.form) setErrors((prev) => ({ ...prev, confirmPassword: '', form: '' }));
                }}
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="login-error" style={{ marginTop: '4px', marginBottom: 0 }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary login-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
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

import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';

export default function CTASection({
  eyebrow = 'Ready when you are',
  title = 'Your next skill is one click away.',
  subtitle = 'Jump into your roadmap and see exactly what to learn next.',
  ctaLabel = 'Start Your Journey',
  ctaTo = '/skills',
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner card">
          <div className="cta-banner-glow" aria-hidden="true" />
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="cta-banner-title">{title}</h2>
          <p className="cta-banner-subtitle">{subtitle}</p>
          <Link to={ctaTo} className="btn btn-primary">
            {ctaLabel}
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

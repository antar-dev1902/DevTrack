import { Link } from 'react-router-dom';
import Icon from './icons/ImageIcon.jsx';
import heroIllustration from '../assets/images/hero-illustration.webp';

export default function Hero() {
  return (
    <section className="hero section">
      <div className="container hero-grid">
        <div className="hero-copy fade-up">
          <span className="eyebrow">
            <Icon name="compass" size={14} />
            Your developer journey, mapped out
          </span>
          <h1 className="hero-heading">
            Build your <span className="gradient-text">developer journey.</span>
          </h1>
          <p className="hero-subtext">
            Learn the right skills. Build real projects. Discover opportunities.
            DevTrack shows you exactly what to learn next and what to build with it.
          </p>
          <div className="hero-ctas">
            <Link to="/skills" className="btn btn-primary">
              Start Your Journey
              <Icon name="arrowRight" size={16} />
            </Link>
            <Link to="/skills" className="btn btn-secondary">
              Explore Roadmap
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>5</strong> developer paths
            </div>
            <div>
              <strong>40+</strong> tracked skills
            </div>
            <div>
              <strong>live</strong> hackathon feed
            </div>
          </div>
        </div>

        <div className="hero-visual fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="workspace">
            <img
              src={heroIllustration}
              alt="Illustration of a developer at a desk working across two monitors showing code"
              className="hero-illustration-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

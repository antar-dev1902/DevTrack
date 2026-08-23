import Icon from './icons/ImageIcon.jsx';

const steps = [
  {
    number: '01',
    icon: 'compass',
    title: 'Choose a Path',
    description: 'Pick the developer track that fits where you want to go — frontend, backend, full stack, and more.',
  },
  {
    number: '02',
    icon: 'book',
    title: 'Learn Skills',
    description: 'Work through the roadmap for your path and mark each skill complete as you learn it.',
  },
  {
    number: '03',
    icon: 'code',
    title: 'Build Projects',
    description: 'Apply what you learned to real, task-based projects instead of leaving it theoretical.',
  },
  {
    number: '04',
    icon: 'users',
    title: 'Discover Opportunities',
    description: 'Browse live hackathons and challenges that match the skills you have been building.',
  },
  {
    number: '05',
    icon: 'target',
    title: 'Track Growth',
    description: 'Watch your XP, completed skills, and finished projects add up on your profile.',
  },
];

export default function ProcessSteps() {
  return (
    <section className="section section-tight">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>How DevTrack works</h2>
          <p>
            Five steps from picking a path to watching your progress compound.
          </p>
        </div>

        <div className="process-steps">
          {steps.map((step, i) => (
            <div key={step.number} className="step-card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="step-card-top">
                <span className="step-card-number">{step.number}</span>
                <span className="step-card-icon">
                  <Icon name={step.icon} size={20} />
                </span>
              </div>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.description}</p>
              {i < steps.length - 1 && <span className="step-card-arrow"><Icon name="arrowRight" size={16} /></span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Hero from '../components/Hero.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import CTASection from '../components/CTASection.jsx';
import '../styles/home.css';

export default function Home() {
  return (
    <>
      <Hero />
      <ProcessSteps />
      <CTASection />
    </>
  );
}

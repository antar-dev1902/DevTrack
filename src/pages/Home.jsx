import Hero from '../components/Hero.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import CTASection from '../components/CTASection.jsx';
import ContinueLearning from '../components/ContinueLearning.jsx';
import '../styles/home.css';

export default function Home() {
  return (
    <>
      <Hero />
      <ContinueLearning />
      <ProcessSteps />
      <CTASection />
    </>
  );
}

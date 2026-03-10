import Hero from './components/Hero/Hero';
import Problem from './components/Problem/Problem';
import Solution from './components/Solution/Solution';
import Benefits from './components/Benefits/Benefits';
import Differentiation from './components/Differentiation/Differentiation';
import WhyNow from './components/WhyNow/WhyNow';
import CaseSkadi from './components/CaseSkadi/CaseSkadi';
import Team from './components/Team/Team';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <div id="app">
      <Hero />
      <Problem />
      <Solution />
      <Benefits />
      <Differentiation />
      <WhyNow />
      <CaseSkadi />
      <Team />
      <CTA />
      <Footer />
    </div>
  );
}


import Hero from './components/Hero/Hero';
import Problem from './components/Problem/Problem';
import Solution from './components/Solution/Solution';
import Benefits from './components/Benefits/Benefits';
import Differentiation from './components/Differentiation/Differentiation';
import WhyNow from './components/WhyNow/WhyNow';
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
      <Footer />
    </div>
  );
}


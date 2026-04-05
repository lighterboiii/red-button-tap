import { useState } from 'react';
import Header from './components/Header/Header';
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
  const [lang, setLang] = useState('ru');
  return (
    <div id="app">
      <Header lang={lang} onLangChange={setLang} />
      <Hero lang={lang} />
      <WhyNow lang={lang} />
      <Problem lang={lang} />
      <Solution lang={lang} />
      <Benefits lang={lang} />
      <Differentiation lang={lang} />
      <CaseSkadi lang={lang} />
      <Team lang={lang} />
      <CTA lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}


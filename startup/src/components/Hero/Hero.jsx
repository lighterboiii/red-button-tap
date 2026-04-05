import './Hero.css';
import { HERO_COPY } from '../../content/hero';

export default function Hero({ lang = 'ru' }) {
  const HERO = HERO_COPY[lang] || HERO_COPY.ru;
  return (
    <header className="hero" id="hero">
      <div className="hero__wrap">
      <div className="hero__content">
        <div className="hero__eyebrow">{HERO.eyebrow}</div>
        <h1 className="hero__title">
          {HERO.titleLines.map((line) => (
            <span key={line} className="hero__title-line">
              {line}
            </span>
          ))}
        </h1>
        <p className="hero__subtitle">{HERO.subtitle}</p>
        <p className="hero__note">{HERO.trust}</p>
        <div className="hero__pill-row">
          {HERO.pills.map((text) => (
            <span key={text} className="hero__pill">
              {text}
            </span>
          ))}
        </div>
      </div>
      </div>
    </header>
  );
}

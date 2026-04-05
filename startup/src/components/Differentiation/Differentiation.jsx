import './Differentiation.css';
import { DIFFERENTIATION_COPY } from '../../content/differentiation';

export default function Differentiation({ lang = 'ru' }) {
  const DIFFERENTIATION = DIFFERENTIATION_COPY[lang] || DIFFERENTIATION_COPY.ru;
  return (
    <section className="differentiation" id="differentiation">
      <div className="differentiation__inner">
        <div className="differentiation__text">
          <h2 className="differentiation__title">
            {lang === 'ru' ? 'Мы ' : 'We '}
            <span className="differentiation__title-accent">
              {DIFFERENTIATION.titleAccent}
            </span>{' '}
            {lang === 'ru' ? 'с крупными вендорами' : 'with major vendors'}
          </h2>
          <ul className="differentiation__list">
            {DIFFERENTIATION.bullets.map((item) => (
              <li key={item} className="differentiation__item">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="differentiation__diagram">
          <div className="differentiation__layer-box">
            <span className="differentiation__layer-icon" aria-hidden>
              <span /><span /><span />
            </span>
            <span className="differentiation__layer-name">XRABLE</span>
            <span className="differentiation__layer-tag">LAYER</span>
          </div>
          <p className="differentiation__over-label">{DIFFERENTIATION.diagram.layerLabel}</p>
          <div className="differentiation__vendors">
            {DIFFERENTIATION.diagram.vendors.map((name) => (
              <div key={name} className="differentiation__vendor">
                {name}
              </div>
            ))}
          </div>
          <p className="differentiation__caption">{DIFFERENTIATION.diagram.caption}</p>
        </div>
      </div>
    </section>
  );
}

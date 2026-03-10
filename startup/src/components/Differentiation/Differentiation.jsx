import './Differentiation.css';

/**
 * Отстройка от рынка / от Google XR и других.
 * Где XRABLE на карте рынка: не «ещё одна XR-платформа», а новый инфраструктурный уровень.
 */
const DIFFERENTIATION = {
  title: 'Мы не конкурируем с крупными вендорами',
  titleAccent: 'конкурируем',
  bullets: [
    'Не заменяем Apple или Google',
    'Архитектурный слой над экосистемами',
    'Проверенный инфраструктурный подход',
  ],
  diagram: {
    layerLabel: 'НАД',
    caption: 'Нейтральный архитектурный слой',
    vendors: ['Apple', 'Google', 'Microsoft', 'Meta'],
  },
};

export default function Differentiation() {
  return (
    <section className="differentiation" id="differentiation">
      <div className="differentiation__inner">
        <div className="differentiation__text">
          <h2 className="differentiation__title">
            Мы не{' '}
            <span className="differentiation__title-accent">
              {DIFFERENTIATION.titleAccent}
            </span>{' '}
            с крупными вендорами
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

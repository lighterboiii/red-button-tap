import './CaseSkadi.css';

/**
 * История успеха / кейс SKADI — блок доверия.
 * Идея выросла из реального опыта внедрения; практика доказала ценность слоя управления.
 * Рынок подтвердил спрос, XRABLE — следующий шаг от пилота к платформе.
 */
const CASE_SKADI = {
  eyebrow: 'История успеха',
  title: 'SKADI',
  lead: 'Идея XRABLE не взялась из воздуха — она выросла из реального опыта внедрения wearable и XR-сценариев в промышленности.',
  points: [
    'Такие решения уже работали в промышленном контуре, в том числе в нефтегазе.',
    'Практика доказала ценность не только устройства, но и слоя управления сценарием.',
  ],
  thesis: 'Рынок уже подтвердил спрос. XRABLE — следующий шаг от пилота к платформе.',
};

export default function CaseSkadi() {
  return (
    <section className="case-skadi" id="case">
      <div className="case-skadi__wrap">
        <div className="case-skadi__inner">
          <p className="case-skadi__eyebrow">{CASE_SKADI.eyebrow}</p>
          <h2 className="case-skadi__title">{CASE_SKADI.title}</h2>
          <p className="case-skadi__lead">{CASE_SKADI.lead}</p>
          <ul className="case-skadi__list">
            {CASE_SKADI.points.map((point) => (
              <li key={point} className="case-skadi__item">
                {point}
              </li>
            ))}
          </ul>
          <p className="case-skadi__thesis">{CASE_SKADI.thesis}</p>
        </div>
        <div className="case-skadi__media" aria-hidden>
          <span className="case-skadi__placeholder">Изображение</span>
        </div>
      </div>
    </section>
  );
}

import './Problem.css';

/**
 * Проблема рынка — почему нужен XRABLE.
 * Сетка из 4 карточек, как Benefits.
 */
const LOCK_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const PROBLEM_CARDS = [
  {
    title: 'Фрагментированный рынок носимых устройств',
    lead: 'Изолированные экосистемы без общих стандартов',
    visual: true,
    points: ['Закрытый SDK', 'Закрытые протоколы', 'Нет связей между экосистемами'],
  },
  {
    title: 'Свои сценарии внутри чужой экосистемы',
    text: 'XR-процесс живёт внутри платформы вендора: бизнес не контролирует исполнение и развитие сценария.',
  },
  {
    title: 'Дорогое тиражирование и эксперименты',
    text: 'Запуск пилота под одну платформу не переносится на другие. Любой новый кейс — почти как новое внедрение.',
  },
  {
    title: 'Проблема не в отсутствии очков',
    text: 'Рынок фрагментирован, у каждого производителя свой стек. Это создаёт vendor lock-in — главное ограничение роста.',
  },
];

export default function Problem() {
  return (
    <section className="problem" id="problem">
      <div className="problem__content">
        <h2 className="problem__title">Проблема рынка</h2>
        <div className="problem__grid">
          {PROBLEM_CARDS.map((card) => (
            <article key={card.title} className="problem__card">
              <h3 className="problem__card-title">{card.title}</h3>
              {card.lead && <p className="problem__card-lead">{card.lead}</p>}
              {card.visual && (
                <div className="problem__card-visual">
                  <span className="problem__card-visual-icon">{LOCK_ICON}</span>
                  <span className="problem__card-visual-line">Закрытый SDK</span>
                  <span className="problem__card-visual-line">Закрытые протоколы</span>
                  <span className="problem__card-visual-note">Нет связей между экосистемами</span>
                </div>
              )}
              {card.points && !card.visual && (
                <ul className="problem__card-points">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
              {card.text && <p className="problem__card-text">{card.text}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


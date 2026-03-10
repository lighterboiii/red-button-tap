import './WhyNow.css';

/**
 * Почему сейчас / историчность рынка.
 * XRABLE появляется в правильный момент: рынок готов к слою стандартизации, а не только к устройствам.
 */
const WHY_NOW = {
  title: 'Почему сейчас',
  lead: 'Рынок XR проходит знакомый путь: сначала появляются разные устройства и закрытые экосистемы, потом фрагментация, затем спрос на независимый стандартный слой. XRABLE — ответ на закономерный этап взросления рынка.',
  thesis: 'Сейчас рынок готов не только к устройствам, но и к слою стандартизации.',
  adoption: {
    title: 'Корпоративные',
    titleAccent: 'AR/XR-устройства',
    titleEnd: 'активно внедряются',
    sectors: ['Промышленность', 'Логистика', 'Безопасность', 'Обучение'],
    footnote: 'Корпоративное внедрение уже происходит',
  },
  fragmentation: {
    title: 'Фрагментированный рынок',
    titleAccent: 'носимых устройств',
    subtitle: 'Изолированные экосистемы без общих стандартов',
    vendors: ['Apple', 'Google', 'Microsoft', 'Meta'],
    closed: ['Закрытый SDK', 'Закрытые протоколы'],
  },
  gap: {
    title: 'Почему рынок не решает',
    titleAccent: 'проблему',
    titleEnd: 'самостоятельно',
    statement: 'Отсутствует архитектурный слой между бизнесом и устройствами',
    missingLabel: 'Отсутствие инфраструктурного компонента',
    conclusion: 'Отсутствие архитектурного слоя создаёт барьер для масштабирования',
  },
};

export default function WhyNow() {
  return (
    <section className="why-now">
      <div className="why-now__inner">
        <h2 className="why-now__title">{WHY_NOW.title}</h2>
        <p className="why-now__lead">{WHY_NOW.lead}</p>
        <p className="why-now__thesis">{WHY_NOW.thesis}</p>

        <div className="why-now__cards">
          <div className="why-now__card">
            <h3 className="why-now__card-title">
              {WHY_NOW.adoption.title}{' '}
              <span className="why-now__accent">{WHY_NOW.adoption.titleAccent}</span>{' '}
              {WHY_NOW.adoption.titleEnd}
            </h3>
            <p className="why-now__sectors">
              {WHY_NOW.adoption.sectors.join(' · ')}
            </p>
            <p className="why-now__footnote">{WHY_NOW.adoption.footnote}</p>
          </div>

          <div className="why-now__card">
            <h3 className="why-now__card-title">
              {WHY_NOW.fragmentation.title}{' '}
              <span className="why-now__accent">{WHY_NOW.fragmentation.titleAccent}</span>
            </h3>
            <p className="why-now__subtitle">{WHY_NOW.fragmentation.subtitle}</p>
            <div className="why-now__vendors">
              {WHY_NOW.fragmentation.vendors.map((name) => (
                <div key={name} className="why-now__vendor">
                  <span className="why-now__vendor-name">{name}</span>
                  <span className="why-now__vendor-closed">
                    {WHY_NOW.fragmentation.closed.join(' · ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="why-now__card why-now__card--gap">
            <h3 className="why-now__card-title">
              {WHY_NOW.gap.title}{' '}
              <span className="why-now__accent">{WHY_NOW.gap.titleAccent}</span>{' '}
              {WHY_NOW.gap.titleEnd}
            </h3>
            <p className="why-now__statement">{WHY_NOW.gap.statement}</p>
            <div className="why-now__diagram">
              <div className="why-now__diagram-top">
                <span className="why-now__diagram-icon">◫</span>
                <span>Business</span>
              </div>
              <div className="why-now__diagram-missing">
                <span className="why-now__diagram-x" aria-hidden>×</span>
                <span className="why-now__diagram-label">{WHY_NOW.gap.missingLabel}</span>
              </div>
              <div className="why-now__diagram-bottom">
                <span className="why-now__diagram-icon">▣</span>
                <span>Devices</span>
              </div>
            </div>
            <p className="why-now__conclusion">{WHY_NOW.gap.conclusion}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

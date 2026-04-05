import './WhyNow.css';
import { WHY_NOW_COPY } from '../../content/whyNow';

export default function WhyNow({ lang = 'ru' }) {
  const WHY_NOW = WHY_NOW_COPY[lang] || WHY_NOW_COPY.ru;
  return (
    <section className="why-now" id="why-now">
      <div className="why-now__inner">
        <div className="why-now__text">
          <h2 className="why-now__title">
            <span className="why-now__title-line2">
              {lang === 'ru' ? 'ПОЧЕМУ' : 'WHY'}
            </span>
            <span className="why-now__title-line2">
              {lang === 'ru' ? 'СЕЙЧАС' : 'NOW'}
            </span>
          </h2>
          <p className="why-now__lead">{WHY_NOW.lead}</p>
          <p className="why-now__lead">{WHY_NOW.lead2}</p>
          {WHY_NOW.thesis.map((line) => (
            <p key={line} className="why-now__thesis">
              {line}
            </p>
          ))}
        </div>

        <div className="why-now__cards">
          <div className="why-now__card why-now__card--white">
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

          <div className="why-now__card why-now__card--gray">
            <h3 className="why-now__card-title">
              {WHY_NOW.fragmentation.title}{' '}
              <span className="why-now__accent">{WHY_NOW.fragmentation.titleAccent}</span>
            </h3>
            <p className="why-now__subtitle">{WHY_NOW.fragmentation.subtitle}</p>
            <div className="why-now__vendors">
              {WHY_NOW.fragmentation.vendors.map((name) => (
                <div key={name} className="why-now__vendor">
                  <span className="why-now__vendor-name">{name}</span>
                </div>
              ))}
            </div>
            <div className="why-now__fragmentation-connector" aria-hidden />
            <p className="why-now__fragmentation-note">
              {WHY_NOW.fragmentation.closed.join(' · ')}
            </p>
          </div>

          <div className="why-now__card why-now__card--gap why-now__card--accent">
            <div className="why-now__gap-wrap">
              <div className="why-now__gap-text">
                <h3 className="why-now__card-title">
                  {WHY_NOW.gap.title}{' '}
                  <span className="why-now__accent">{WHY_NOW.gap.titleAccent}</span>{' '}
                  {WHY_NOW.gap.titleEnd}
                </h3>
                <p className="why-now__statement">{WHY_NOW.gap.statement}</p>
                {WHY_NOW.gap.conclusion && (
                  <p className="why-now__conclusion">{WHY_NOW.gap.conclusion}</p>
                )}
              </div>
              <div className="why-now__gap-visual">
                <div className="why-now__diagram">
                  <div className="why-now__diagram-top">
                    <span className="why-now__diagram-icon">◫</span>
                    <span>{lang === 'ru' ? 'Бизнес' : 'Business'}</span>
                  </div>
                  <div className="why-now__diagram-missing">
                    <span className="why-now__diagram-x" aria-hidden>×</span>
                    <span className="why-now__diagram-label">{WHY_NOW.gap.missingLabel}</span>
                  </div>
                  <div className="why-now__diagram-bottom">
                    <span className="why-now__diagram-icon">▣</span>
                    <span>{lang === 'ru' ? 'Устройства' : 'Devices'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import './Benefits.css';
import { MODEL_LABEL_COPY, WIN_WIN_WIN_COPY, BENEFITS_COPY } from '../../content/benefits';

export default function Benefits({ lang = 'ru' }) {
  const MODEL_LABEL = MODEL_LABEL_COPY[lang] || MODEL_LABEL_COPY.ru;
  const WIN_WIN_WIN = WIN_WIN_WIN_COPY[lang] || WIN_WIN_WIN_COPY.ru;
  const BENEFITS = BENEFITS_COPY[lang] || BENEFITS_COPY.ru;
  return (
    <section className="benefits" id="benefits">
      <div className="benefits__wrap">
        <div className="benefits__inner">
          <div className="benefits__text">
            <h2 className="benefits__title">{BENEFITS.title.toUpperCase()}</h2>
            <p className="benefits__lead">{BENEFITS.lead}</p>
          </div>
        <div className="benefits__grid">
          {BENEFITS.items.map((item) => (
            <article key={item.title} className="benefits__card">
              <h3 className="benefits__card-title">{item.title}</h3>
              <p className="benefits__card-text">{item.text}</p>
            </article>
          ))}
        </div>
        </div>
        <div className="benefits__model-block">
          <h3 className="benefits__model-title">
            <span className="benefits__model-highlight">{MODEL_LABEL.highlight}</span>{' '}
            <span className="benefits__model-suffix">{MODEL_LABEL.suffix}</span>
          </h3>
          <div className="benefits__model-cols">
            {WIN_WIN_WIN.map((col) => (
              <div key={col.id} className="benefits__model-col">
                <div className="benefits__model-icon" aria-hidden>
                  {col.id === 'business' && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M19 21v-9l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>
                  )}
                  {col.id === 'vendors' && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                  )}
                  {col.id === 'developers' && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
                  )}
                </div>
                <div className="benefits__model-card">
                  <h4 className="benefits__model-card-title">{col.title}</h4>
                  <p className="benefits__model-text">{col.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

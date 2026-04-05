import './Problem.css';
import { PROBLEM_COPY } from '../../content/problem';

export default function Problem({ lang = 'ru' }) {
  const PROBLEM = PROBLEM_COPY[lang] || PROBLEM_COPY.ru;
  return (
    <section className="problem" id="problem">
      <div className="problem__inner">
        <div className="problem__text">
          <h2 className="problem__title">
            <span className="problem__title-line2">{PROBLEM.title.toUpperCase()}</span>
            <span className="problem__title-line2">{PROBLEM.titleLine2.toUpperCase()}</span>
          </h2>
          <p className="problem__lead">{PROBLEM.lead}</p>
        </div>
        <div className="problem__grid">
          {PROBLEM.stats.map((stat, i) => (
            <div
              key={i}
              className={`problem__stat problem__stat--${stat.variant}`}
            >
              <span className="problem__stat-value">{stat.value}</span>
              <span className="problem__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import './Solution.css';
import { SOLUTION_COPY } from '../../content/solution';

export default function Solution({ lang = 'ru' }) {
  const SOLUTION = SOLUTION_COPY[lang] || SOLUTION_COPY.ru;
  return (
    <section className="solution" id="solution">
      <div className="solution__wrap">
      <div className="solution__content">
        <h2 className="solution__title">{SOLUTION.title}</h2>
        <p className="solution__lead">{SOLUTION.lead}</p>
        <p className="solution__body">{SOLUTION.body}</p>
        <p className="solution__thesis">{SOLUTION.thesis}</p>
      </div>
      </div>
    </section>
  );
}

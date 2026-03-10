import './Solution.css';

/**
 * Решение / что делает XRABLE — суть продукта.
 * Смысл: XRABLE превращает разрозненные XR-внедрения в управляемую и переносимую систему.
 */
const SOLUTION = {
  title: 'Что делает XRABLE',
  lead:
    'XRABLE — единый слой исполнения, совместимости и управления, который соединяет бизнес-сценарии с разными устройствами.',
  body: 'Один раз описать рабочий процесс — потом запускать, контролировать и масштабировать без жёсткой зависимости от одного производителя.',
  thesis: 'XRABLE превращает разрозненные XR-внедрения в управляемую и переносимую систему.',
};

export default function Solution() {
  return (
    <section className="solution" id="solution">
      <div className="solution__content">
        <h2 className="solution__title">{SOLUTION.title}</h2>
        <p className="solution__lead">{SOLUTION.lead}</p>
        <p className="solution__body">{SOLUTION.body}</p>
        <p className="solution__thesis">{SOLUTION.thesis}</p>
      </div>
    </section>
  );
}

import './CTA.css';

/**
 * CTA / финальный экран — переводим интерес в действие.
 * Приглашение к следующему шагу: демо, пилот, партнёрство.
 */
const CTA = {
  title: 'Готовы обсудить пилот, внедрение или партнёрство?',
  lead: 'XRABLE — уже не просто идея, а продукт, с которым можно начинать работать.',
  thesis: 'Мы готовы говорить про пилот, внедрение и партнёрство уже сейчас.',
  primaryButton: 'Запросить демо',
  options: [
    'Обсудить пилот',
    'Партнёрство по устройствам',
    'Партнёрство по интеграциям',
  ],
};

export default function CTABlock() {
  return (
    <section className="cta">
      <div className="cta__inner">
        <h2 className="cta__title">{CTA.title}</h2>
        <p className="cta__lead">{CTA.lead}</p>
        <p className="cta__thesis">{CTA.thesis}</p>
        <a href="mailto:hello@xrable.com" className="cta__button">
          {CTA.primaryButton}
        </a>
        <div className="cta__options">
          {CTA.options.map((label) => (
            <span key={label} className="cta__pill">
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

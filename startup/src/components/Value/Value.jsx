import './Value.css';

/**
 * Секция по скелету презентации: Проблема → Решение → Почему мы.
 */
const VALUE = {
  title: '',
  cards: [
    {
      title: 'Проблема',
      text: 'Бизнес не контролирует wearable‑инфраструктуру и зависит от конкретных устройств и вендоров.',
    },
    {
      title: 'Решение',
      text: 'XRABLE даёт единый runtime и платформу: сценарии работают поверх wearable‑устройств, а не привязаны к одному девайсу.',
    },
    {
      title: 'Почему мы',
      text: 'Платформа снижает vendor lock‑in, ускоряет внедрение и превращает wearable в управляемую B2B‑инфраструктуру.',
    },
  ],
};

export default function Value() {
  return (
    <main className="value">
      <section className="value__section">
        {VALUE.title && <h2 className="value__title">{VALUE.title}</h2>}
        <div className="value__grid">
          {VALUE.cards.map((card) => (
            <div key={card.title} className="value__card">
              <h3 className="value__card-title">{card.title}</h3>
              <p className="value__card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

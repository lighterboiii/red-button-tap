import './Benefits.css';

/**
 * Что получает бизнес — 4 равные карточки ценности.
 * Тексты-заглушки, позже подставим финальные формулировки из скриншотов.
 */
const BENEFITS = [
  {
    title: 'Бизнес владеет сценарием',
    text: 'XR-сценарий принадлежит компании, а не платформе устройства. Логика и данные остаются у вас, даже если меняется вендор.',
  },
  {
    title: 'Быстрый запуск процессов',
    text: 'Один раз описанный процесс можно запускать на разных устройствах без долгой доработки под каждое новое железо.',
  },
  {
    title: 'Меньше стоимости внедрения',
    text: 'Сценарии переносимы между устройствами и площадками, поэтому не нужно каждый раз строить внедрение с нуля.',
  },
  {
    title: 'Масштабирование без lock-in',
    text: 'Легче расширять парк устройств и менять технологии, не теряя инвестиции в сценарии и контент.',
  },
];

export default function Benefits() {
  return (
    <section className="benefits">
      <div className="benefits__content">
        <h2 className="benefits__title">Что получает бизнес</h2>
        <div className="benefits__grid">
          {BENEFITS.map((item) => (
            <article key={item.title} className="benefits__card">
              <h3 className="benefits__card-title">{item.title}</h3>
              <p className="benefits__card-text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


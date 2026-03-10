import { useRef, useEffect } from 'react';
import './Benefits.css';

/**
 * Что получает бизнес — горизонтальный скролл колесиком/тачпадом:
 * вертикальный скролл переводится в боковой, одна карточка пролистывается за несколько прокруток (параллакс).
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

const WHEEL_FACTOR = 0.35; // одна карточка уезжает за несколько прокруток
const LERP = 0.06;        // задержка: контент «нехотя» догоняет (параллакс)

export default function Benefits() {
  const scrollRef = useRef(null);
  const targetRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const tick = () => {
      const target = targetRef.current;
      const current = el.scrollLeft;
      const next = current + (target - current) * LERP;
      if (Math.abs(next - target) < 0.5) {
        el.scrollLeft = target;
        rafRef.current = null;
        return;
      }
      el.scrollLeft = next;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      const { deltaY } = e;
      if (deltaY === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollLeft >= maxScroll - 1;
      const scrollingUp = deltaY < 0;
      const scrollingDown = deltaY > 0;

      // В начале блока и скролл вверх — отдаём странице (скролл вверх работает)
      if (atStart && scrollingUp) return;
      // В конце блока и скролл вниз — отдаём странице
      if (atEnd && scrollingDown) return;

      const delta = deltaY * WHEEL_FACTOR;
      targetRef.current = Math.max(0, Math.min(maxScroll, targetRef.current + delta));

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
      e.preventDefault();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    targetRef.current = el.scrollLeft;
  }, []);

  return (
    <section className="benefits-wrap" id="benefits">
      <h2 className="benefits__title">Что получает бизнес</h2>
      <div className="benefits" ref={scrollRef}>
        <div className="benefits__content">
          <div className="benefits__grid">
            {BENEFITS.map((item) => (
              <article key={item.title} className="benefits__card">
                <h3 className="benefits__card-title">{item.title}</h3>
                <p className="benefits__card-text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


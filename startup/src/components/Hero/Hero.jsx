import "./Hero.css";

/**
 * Hero — первый экран. За 3–5 сек: что такое XRABLE.
 * Не очки, не ОС, не приложение — платформенный слой между сценарием бизнеса и устройством.
 * Смысл: отделяем сценарий от железа → свобода, контроль, переносимость. B2B/deeptech тон.
 */
const HERO = {
  eyebrow: "Не очки. Не ОС. Не приложение.",
  title: "Платформенный слой между сценарием работы и устройством",
  subtitle:
    "XRABLE — это не устройство и не софт под одно железо. Это слой, который отделяет рабочий сценарий бизнеса от конкретного девайса. Один сценарий — любые устройства. Свобода, контроль, переносимость.",
  ctaButton: "Кнопка",
  pills: [
    "Свобода выбора устройств",
    "Контроль над сценарием",
    "Переносимость без lock-in",
  ],
};

export default function Hero() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    if (typeof email === "string" && email.trim()) {
      alert("Спасибо. Email получен.");
      e.currentTarget.reset();
    }
  };

  return (
    <header className="hero" id="hero">
      <div className="hero__content">
        <div className="hero__eyebrow">{HERO.eyebrow}</div>
        <h1 className="hero__title">{HERO.title}</h1>
        <p className="hero__subtitle">{HERO.subtitle}</p>
        <button type="submit" className="hero__button">
          {HERO.ctaButton}
        </button>
        <p className="hero__note">{HERO.trust}</p>
        <div className="hero__pill-row">
          {HERO.pills.map((text) => (
            <span key={text} className="hero__pill">
              {text}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

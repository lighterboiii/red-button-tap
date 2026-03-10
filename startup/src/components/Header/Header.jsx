import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#hero" className="site-header__logo">
          XRABLE
        </a>
        <nav className="site-header__nav" aria-label="Основная навигация">
          <a href="#problem" className="site-header__link">
            Проблема
          </a>
          <a href="#solution" className="site-header__link">
            Решение
          </a>
          <a href="#benefits" className="site-header__link">
            Бизнесу
          </a>
          <a href="#differentiation" className="site-header__link">
            Почему мы
          </a>
          <a href="#case" className="site-header__link">
            Кейсы
          </a>
          <a href="#team" className="site-header__link">
            Команда
          </a>
          <a href="#cta" className="site-header__link site-header__link--cta">
            Связаться
          </a>
        </nav>
      </div>
    </header>
  );
}


import { useState } from 'react';
import './Header.css';
import { HEADER_LINKS } from '../../content/header';

export default function Header({ lang = 'ru', onLangChange }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleLinkClick = (e, href) => {
    setOpen(false);
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#hero" className="site-header__logo">
          XRABLE
        </a>
        <button
          type="button"
          className="site-header__toggle"
          aria-label="Open navigation menu"
          aria-expanded={open}
          onClick={handleToggle}
        >
          <span />
          <span />
        </button>
        <nav
          className={`site-header__nav ${open ? 'site-header__nav--open' : ''}`}
          aria-label="Main navigation"
        >
          {(HEADER_LINKS[lang] || HEADER_LINKS.ru).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`site-header__link ${
                link.cta ? 'site-header__link--cta' : ''
              }`}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          {/* Mobile language switcher inside menu */}
          <div
            className="site-header__lang-switch site-header__lang-switch--mobile"
            aria-label="Language switcher"
          >
            <button
              type="button"
              className={`site-header__lang ${
                lang === 'ru' ? 'site-header__lang--active' : ''
              }`}
              onClick={() => onLangChange && onLangChange('ru')}
            >
              RU
            </button>
            <button
              type="button"
              className={`site-header__lang ${
                lang === 'en' ? 'site-header__lang--active' : ''
              }`}
              onClick={() => onLangChange && onLangChange('en')}
            >
              EN
            </button>
          </div>
        </nav>
        {/* Desktop language switcher to the far right */}
        <div
          className="site-header__lang-switch site-header__lang-switch--desktop"
          aria-label="Language switcher"
        >
          <button
            type="button"
            className={`site-header__lang ${
              lang === 'ru' ? 'site-header__lang--active' : ''
            }`}
            onClick={() => onLangChange && onLangChange('ru')}
          >
            RU
          </button>
          <button
            type="button"
            className={`site-header__lang ${
              lang === 'en' ? 'site-header__lang--active' : ''
            }`}
            onClick={() => onLangChange && onLangChange('en')}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}


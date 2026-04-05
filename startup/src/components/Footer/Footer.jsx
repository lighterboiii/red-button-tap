import './Footer.css';

export default function Footer({ lang = 'ru' }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">XRABLE</span>
          <span className="footer__tagline">
            {lang === 'ru'
              ? 'Платформенный слой для носимых устройств'
              : 'Platform layer for wearable devices'}
          </span>
        </div>
        <div className="footer__links">
          <a href="mailto:hello@xrable.com" className="footer__link">
            {lang === 'ru' ? 'Связаться' : 'Contact us'}
          </a>
        </div>
        <p className="footer__copy">
          © {year} XRABLE. {lang === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}

import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">XRABLE</span>
          <span className="footer__tagline">Платформенный слой для носимых устройств</span>
        </div>
        <div className="footer__links">
          <a href="mailto:hello@xrable.com" className="footer__link">
            Связаться
          </a>
        </div>
        <p className="footer__copy">
          © {year} XRABLE. Все права защищены.
        </p>
      </div>
    </footer>
  );
}

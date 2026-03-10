import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <span className="footer__copy">© {year} xrable</span>
    </footer>
  );
}

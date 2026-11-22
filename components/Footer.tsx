export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <a href="#" className="logo">
            86<span>px</span><sup>®</sup>
          </a>
          <nav className="footer__nav" aria-label="Навигация в подвале">
            <a href="#services">Услуги</a>
            <a href="#works">Работы</a>
            <a href="#process">Процесс</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <div className="footer__socials">
            <a href="#" aria-label="Telegram">TG</a>
            <a href="#" aria-label="Behance">BE</a>
            <a href="#" aria-label="Dribbble">DR</a>
            <a href="#" aria-label="VK">VK</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {year} Студия 86px. Все права защищены.</span>
          <span>Сделано с любовью к деталям</span>
        </div>
      </div>
    </footer>
  );
}

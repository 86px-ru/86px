const items = ['Веб-дизайн', 'Разработка', 'Брендинг', 'Моушн', 'E-commerce', 'UI/UX'];

function MarqueeGroup() {
  return (
    <div className="marquee__group">
      {items.map((item) => (
        <span key={item}>
          {item}
          <i></i>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </div>
  );
}

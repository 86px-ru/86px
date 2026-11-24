type ServiceItem = { title: string; text: string; tags: string };

export default function ServicesClient({ items }: { items: ServiceItem[] }) {
  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="section__label">/ 01 — Услуги</span>
          <h2 className="section__title">Что мы <em>делаем</em></h2>
        </div>

        <ul className="services__list">
          {items.map((service, index) => (
            <li
              className="service-item"
              data-index={index}
              data-reveal
              data-delay={index * 80}
              key={index}
            >
              <span className="service-item__num">{String(index + 1).padStart(2, '0')}</span>
              <div className="service-item__body">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
              <span className="service-item__tags">{service.tags}</span>
              <span className="service-item__arrow">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

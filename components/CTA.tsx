import ContactForm from '@/components/ContactForm';
import { getContent } from '@/lib/content';

export default async function CTA() {
  const content = await getContent('cta');

  return (
    <section className="cta" id="contacts">
      <div className="container cta__inner">
        <span className="section__label" data-reveal>/ 05 — Контакты</span>
        <h2 className="cta__title" data-reveal data-delay="100">
          {content.titleLine1}
          <br />
          <em>{content.titleAccent}</em>
        </h2>
        <a href={`mailto:${content.email}`} className="cta__mail" data-reveal data-delay="200">
          {content.email}
        </a>
        <div className="cta__form" data-reveal data-delay="300">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

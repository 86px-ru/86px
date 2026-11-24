import { getContent } from '@/lib/content';

export default async function Process() {
  const content = await getContent('process');
  const steps = content.steps.slice(0, 4);

  return (
    <section className="section process" id="process">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="section__label">/ 03 — Процесс</span>
          <h2 className="section__title">Как мы <em>работаем</em></h2>
        </div>

        <div className="process__grid">
          {steps.map((step, index) => (
            <div className="process-step" data-reveal data-delay={index * 100} key={index}>
              <span className="process-step__num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    num: '01',
    title: 'Исследование',
    text: 'Изучаем рынок, конкурентов и аудиторию. Формулируем цели проекта и критерии успеха.',
  },
  {
    num: '02',
    title: 'Концепция',
    text: 'Прорабатываем стратегию, структуру и визуальный образ будущего продукта.',
  },
  {
    num: '03',
    title: 'Дизайн и разработка',
    text: 'Создаём интерфейсы, пишем код, добавляем анимации — всё в тесной связке друг с другом.',
  },
  {
    num: '04',
    title: 'Запуск и рост',
    text: 'Тестируем, запускаем, анализируем метрики и помогаем продукту развиваться дальше.',
  },
];

export default function Process() {
  return (
    <section className="section process" id="process">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="section__label">/ 03 — Процесс</span>
          <h2 className="section__title">Как мы <em>работаем</em></h2>
        </div>

        <div className="process__grid">
          {steps.map((step, index) => (
            <div className="process-step" data-reveal data-delay={index * 100} key={step.num}>
              <span className="process-step__num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

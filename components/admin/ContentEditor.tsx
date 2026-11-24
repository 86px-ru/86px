'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_CONTENT,
  type CtaContent,
  type HeroContent,
  type ProcessContent,
  type ServicesContent,
  type TestimonialsContent,
} from '@/lib/content';

type AllContent = {
  hero: HeroContent;
  services: ServicesContent;
  process: ProcessContent;
  testimonials: TestimonialsContent;
  cta: CtaContent;
};

type ContentKey = keyof AllContent;

function TextField({
  label,
  value,
  onChange,
  textarea,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Section({
  title,
  saved,
  saving,
  onSave,
  children,
}: {
  title: string;
  saved: boolean;
  saving: boolean;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <div className="content-section">
      <div className="content-section__head">
        <h2>{title}</h2>
        <div className="content-section__actions">
          {saved && <span className="content-section__saved">Сохранено</span>}
          <button className="btn btn--small" onClick={onSave} disabled={saving}>
            {saving ? 'Сохраняю…' : 'Сохранить'}
          </button>
        </div>
      </div>
      <div className="content-section__body">{children}</div>
    </div>
  );
}

export default function ContentEditor() {
  const [data, setData] = useState<AllContent>(() => JSON.parse(JSON.stringify(DEFAULT_CONTENT)));
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [savingKey, setSavingKey] = useState<ContentKey | null>(null);
  const [savedKey, setSavedKey] = useState<ContentKey | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/content');
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        const rows: { key: ContentKey; value: Partial<AllContent[ContentKey]> }[] = await res.json();
        if (!res.ok) throw new Error('Ошибка загрузки');
        setData((prev) => {
          const next = { ...prev };
          for (const row of rows) {
            if (next[row.key] && typeof row.value === 'object') {
              (next as Record<ContentKey, unknown>)[row.key] = {
                ...(next[row.key] as object),
                ...row.value,
              };
            }
          }
          return next;
        });
      } catch {
        setLoadError('Не удалось загрузить сохранённый контент, показаны значения по умолчанию.');
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function save(key: ContentKey) {
    setSavingKey(key);
    setSavedKey(null);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: data[key] }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Ошибка сохранения');
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 3000);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setSavingKey(null);
    }
  }

  const update = <K extends ContentKey>(key: K, value: AllContent[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const hero = data.hero;
  const services = data.services;
  const process = data.process;
  const testimonials = data.testimonials;
  const cta = data.cta;

  return (
    <div className="content-editor">
      {!loaded && <p className="field__hint">Загружаю контент…</p>}
      {loadError && <p className="admin-error">{loadError}</p>}

      <Section title="Главный экран" saving={savingKey === 'hero'} saved={savedKey === 'hero'} onSave={() => save('hero')}>
        <div className="fields-grid">
          <TextField label="Заголовок — строка 1" value={hero.titleLine1} onChange={(v) => update('hero', { ...hero, titleLine1: v })} />
          <TextField label="Заголовок — приставка" value={hero.titlePrefix} onChange={(v) => update('hero', { ...hero, titlePrefix: v })} />
          <TextField label="Акцентное слово (контур)" value={hero.titleAccent} onChange={(v) => update('hero', { ...hero, titleAccent: v })} />
          <TextField label="Текст-подводка" value={hero.text} onChange={(v) => update('hero', { ...hero, text: v })} textarea />
          <TextField label="Статус (плашка)" value={hero.status} onChange={(v) => update('hero', { ...hero, status: v })} />
          <TextField label="Подпись рядом со статусом" value={hero.meta} onChange={(v) => update('hero', { ...hero, meta: v })} />
        </div>
        <span className="field__label">Показатели (3 блока)</span>
        {hero.stats.slice(0, 3).map((stat, i) => (
          <div className="fields-grid fields-grid--3" key={i}>
            <TextField
              label={`Значение ${i + 1}`}
              type="number"
              value={stat.value}
              onChange={(v) => {
                const stats = hero.stats.map((s, j) => (j === i ? { ...s, value: Number(v) || 0 } : s));
                update('hero', { ...hero, stats });
              }}
            />
            <TextField
              label={`Суффикс ${i + 1}`}
              value={stat.suffix}
              onChange={(v) => {
                const stats = hero.stats.map((s, j) => (j === i ? { ...s, suffix: v } : s));
                update('hero', { ...hero, stats });
              }}
            />
            <TextField
              label={`Подпись ${i + 1}`}
              value={stat.label}
              onChange={(v) => {
                const stats = hero.stats.map((s, j) => (j === i ? { ...s, label: v } : s));
                update('hero', { ...hero, stats });
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="Услуги (4 пункта)" saving={savingKey === 'services'} saved={savedKey === 'services'} onSave={() => save('services')}>
        {services.items.slice(0, 4).map((item, i) => (
          <div className="content-sub" key={i}>
            <span className="field__label">Услуга {i + 1}</span>
            <div className="fields-grid">
              <TextField
                label="Название"
                value={item.title}
                onChange={(v) => {
                  const items = services.items.map((s, j) => (j === i ? { ...s, title: v } : s));
                  update('services', { ...services, items });
                }}
              />
              <TextField
                label="Теги"
                value={item.tags}
                onChange={(v) => {
                  const items = services.items.map((s, j) => (j === i ? { ...s, tags: v } : s));
                  update('services', { ...services, items });
                }}
              />
            </div>
            <TextField
              label="Описание"
              value={item.text}
              textarea
              onChange={(v) => {
                const items = services.items.map((s, j) => (j === i ? { ...s, text: v } : s));
                update('services', { ...services, items });
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="Процесс (4 шага)" saving={savingKey === 'process'} saved={savedKey === 'process'} onSave={() => save('process')}>
        {process.steps.slice(0, 4).map((step, i) => (
          <div className="content-sub" key={i}>
            <span className="field__label">Шаг {i + 1}</span>
            <div className="fields-grid">
              <TextField
                label="Название"
                value={step.title}
                onChange={(v) => {
                  const steps = process.steps.map((s, j) => (j === i ? { ...s, title: v } : s));
                  update('process', { ...process, steps });
                }}
              />
              <TextField
                label="Описание"
                value={step.text}
                textarea
                onChange={(v) => {
                  const steps = process.steps.map((s, j) => (j === i ? { ...s, text: v } : s));
                  update('process', { ...process, steps });
                }}
              />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Отзывы (3 карточки)" saving={savingKey === 'testimonials'} saved={savedKey === 'testimonials'} onSave={() => save('testimonials')}>
        {testimonials.items.slice(0, 3).map((item, i) => (
          <div className="content-sub" key={i}>
            <span className="field__label">Отзыв {i + 1}</span>
            <TextField
              label="Текст"
              value={item.text}
              textarea
              onChange={(v) => {
                const items = testimonials.items.map((s, j) => (j === i ? { ...s, text: v } : s));
                update('testimonials', { ...testimonials, items });
              }}
            />
            <div className="fields-grid fields-grid--3">
              <TextField
                label="Имя"
                value={item.name}
                onChange={(v) => {
                  const items = testimonials.items.map((s, j) => (j === i ? { ...s, name: v } : s));
                  update('testimonials', { ...testimonials, items });
                }}
              />
              <TextField
                label="Должность / компания"
                value={item.role}
                onChange={(v) => {
                  const items = testimonials.items.map((s, j) => (j === i ? { ...s, role: v } : s));
                  update('testimonials', { ...testimonials, items });
                }}
              />
              <TextField
                label="Инициалы аватара"
                value={item.initials}
                onChange={(v) => {
                  const items = testimonials.items.map((s, j) => (j === i ? { ...s, initials: v } : s));
                  update('testimonials', { ...testimonials, items });
                }}
              />
            </div>
            <div className="fields-grid fields-grid--2">
              <label className="field">
                <span className="field__label">Цвет аватара 1</span>
                <input
                  type="color"
                  value={item.colorA}
                  onChange={(e) => {
                    const items = testimonials.items.map((s, j) => (j === i ? { ...s, colorA: e.target.value } : s));
                    update('testimonials', { ...testimonials, items });
                  }}
                />
              </label>
              <label className="field">
                <span className="field__label">Цвет аватара 2</span>
                <input
                  type="color"
                  value={item.colorB}
                  onChange={(e) => {
                    const items = testimonials.items.map((s, j) => (j === i ? { ...s, colorB: e.target.value } : s));
                    update('testimonials', { ...testimonials, items });
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Контакты (призыв к действию)" saving={savingKey === 'cta'} saved={savedKey === 'cta'} onSave={() => save('cta')}>
        <div className="fields-grid">
          <TextField label="Заголовок — строка 1" value={cta.titleLine1} onChange={(v) => update('cta', { ...cta, titleLine1: v })} />
          <TextField label="Акцентная строка (контур)" value={cta.titleAccent} onChange={(v) => update('cta', { ...cta, titleAccent: v })} />
          <TextField label="Email" type="email" value={cta.email} onChange={(v) => update('cta', { ...cta, email: v })} />
        </div>
      </Section>
    </div>
  );
}

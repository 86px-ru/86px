'use client';

import { useState, type FormEvent } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, message, company, consent }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Не удалось отправить заявку');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="contact-form contact-form--success">
        <svg className="contact-form__check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12.5l2.7 2.7L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Заявка отправлена</h3>
        <p>Спасибо! Ответим вам в течение рабочего дня.</p>
        <button className="btn btn--ghost btn--small" onClick={() => { setSent(false); setMessage(''); }}>
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="field">
        <span className="field__label">Ваше имя *</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Александр"
          required
        />
      </label>

      <label className="field">
        <span className="field__label">Email или телефон *</span>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="you@company.ru или +7 900 000-00-00"
          required
        />
      </label>

      <label className="field">
        <span className="field__label">О проекте *</span>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Несколько слов о задаче: какой сайт нужен, сроки, бюджет"
          required
        />
      </label>

      {/* Honeypot для ботов */}
      <label className="hp-field" aria-hidden="true">
        Компания
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          Соглашаюсь с{' '}
          <a href="/privacy" target="_blank" rel="noreferrer">
            политикой обработки персональных данных
          </a>
        </span>
      </label>

      {error && <p className="admin-error">{error}</p>}

      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Отправляю…' : 'Отправить заявку'}
      </button>

      <p className="contact-form__note">
        или напишите напрямую в{' '}
        <a href="#" target="_blank" rel="noreferrer">Telegram</a>
      </p>
    </form>
  );
}

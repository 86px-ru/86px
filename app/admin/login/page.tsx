'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Не удалось войти');
      }
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти');
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <a href="/" className="logo login-page__logo">
        86<span>px</span><sup>®</sup>
      </a>
      <form className="login-card" onSubmit={submit}>
        <h1 className="login-card__title">Вход в админку</h1>
        <label className="field">
          <span className="field__label">Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Проверяю…' : 'Войти'}
        </button>
        <a className="login-card__back" href="/">← На сайт</a>
      </form>
    </main>
  );
}

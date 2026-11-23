'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

const VARIANTS = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string;
  variant: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
};

const emptyForm = {
  title: '',
  description: '',
  tags: '',
  variant: 'v1',
  image_url: null as string | null,
  is_published: true,
};

export default function AdminPanel() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setListError('');
    try {
      const res = await fetch('/api/projects');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
      setItems(data);
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  function startEdit(p: Project) {
    setForm({
      title: p.title,
      description: p.description,
      tags: p.tags,
      variant: p.variant,
      image_url: p.image_url,
      is_published: p.is_published,
    });
    setEditingId(p.id);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Укажите название проекта');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const res = await fetch(editingId ? `/api/projects/${editingId}` : '/api/projects', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Ошибка сохранения');
      resetForm();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  async function toggle(p: Project) {
    setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_published: !x.is_published } : x)));
    await fetch(`/api/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !p.is_published }),
    });
  }

  async function remove(p: Project) {
    if (!window.confirm(`Удалить проект «${p.title}»?`)) return;
    await fetch(`/api/projects/${p.id}`, { method: 'DELETE' });
    if (editingId === p.id) resetForm();
    await load();
  }

  async function onFileChange(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setFormError('');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Ошибка загрузки файла');
      setForm((f) => ({ ...f, image_url: json.url }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <>
      <div className="admin__head">
        <div>
          <span className="section__label">Админка</span>
          <h1 className="admin__title">Портфолио</h1>
        </div>
        <button className="btn btn--ghost btn--small" onClick={logout}>Выйти</button>
      </div>

      <div className="admin__grid">
        <form className="admin-form" onSubmit={save}>
          <h2 className="admin-form__title">{editingId ? 'Редактировать проект' : 'Новый проект'}</h2>

          <label className="field">
            <span className="field__label">Название *</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Aurora"
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Описание</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Финтех-приложение"
            />
          </label>

          <label className="field">
            <span className="field__label">Теги (через запятую)</span>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="Mobile, Product"
            />
          </label>

          <div className="field">
            <span className="field__label">Обложка</span>
            <div className="variant-picker">
              {VARIANTS.map((v) => (
                <label key={v} className={`variant-option${form.variant === v && !form.image_url ? ' active' : ''}`}>
                  <input
                    type="radio"
                    name="variant"
                    checked={form.variant === v && !form.image_url}
                    onChange={() => setForm((f) => ({ ...f, variant: v, image_url: null }))}
                  />
                  <span className={`variant-thumb ${v}`}></span>
                  <span className="variant-option__name">{v}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field__label">Или свое изображение (до 5 МБ)</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0])}
              disabled={uploading}
            />
            {form.image_url && (
              <div className="upload-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Обложка проекта" />
                <button
                  type="button"
                  className="upload-preview__remove"
                  onClick={() => set('image_url', null)}
                >
                  Убрать
                </button>
              </div>
            )}
            {uploading && <p className="field__hint">Загружаю…</p>}
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set('is_published', e.target.checked)}
            />
            <span>Опубликован на сайте</span>
          </label>

          {formError && <p className="admin-error">{formError}</p>}

          <div className="admin-form__actions">
            <button className="btn btn--small" type="submit" disabled={saving || uploading}>
              {saving ? 'Сохраняю…' : editingId ? 'Сохранить изменения' : 'Добавить проект'}
            </button>
            {editingId && (
              <button type="button" className="btn btn--ghost btn--small" onClick={resetForm}>
                Отмена
              </button>
            )}
          </div>
        </form>

        <div className="admin-list">
          {loading && <p className="field__hint">Загружаю проекты…</p>}
          {listError && <p className="admin-error">{listError}</p>}
          {!loading && !items.length && (
            <p className="field__hint">Проектов пока нет. Добавьте первый через форму слева.</p>
          )}
          {items.map((p) => (
            <div className={`admin-item${p.is_published ? '' : ' is-draft'}`} key={p.id}>
              {p.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className="admin-item__thumb" src={p.image_url} alt={p.title} />
              ) : (
                <span className={`admin-item__thumb variant-thumb ${p.variant}`}></span>
              )}
              <div className="admin-item__body">
                <b>{p.title}</b>
                <span className="admin-item__desc">{p.description || '—'}</span>
                <span className="admin-item__meta">
                  {p.tags || 'без тегов'} · {new Date(p.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="admin-item__actions">
                <button
                  className={`btn btn--small ${p.is_published ? 'btn--ghost' : ''}`}
                  onClick={() => toggle(p)}
                  title={p.is_published ? 'Скрыть с сайта' : 'Опубликовать'}
                >
                  {p.is_published ? 'Скрыть' : 'Опубликовать'}
                </button>
                <button className="btn btn--ghost btn--small" onClick={() => startEdit(p)}>
                  Изменить
                </button>
                <button className="btn btn--ghost btn--small btn--danger" onClick={() => remove(p)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

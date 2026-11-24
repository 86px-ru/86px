import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  // Honeypot: скрытое поле, заполняют только боты — притворяемся, что всё отправлено
  if (clean(body.company, 200).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const contact = clean(body.contact, 200);
  const message = clean(body.message, 2000);

  if (!name || !contact || !message) {
    return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: 'Нужно согласие на обработку персональных данных' },
      { status: 400 }
    );
  }

  const text = [
    'Новая заявка с сайта 86px.ru',
    '',
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    '',
    'Сообщение:',
    message,
  ].join('\n');

  const tgToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || '';
  const tgChat = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || '';
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );

  if (!(tgToken && tgChat) && !smtpConfigured) {
    return NextResponse.json(
      { error: 'Форма не настроена: задайте SMTP_* или TELEGRAM_* переменные окружения' },
      { status: 503 }
    );
  }

  const failures: string[] = [];

  if (tgToken && tgChat) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        const detail = (await res.text().catch(() => '')).slice(0, 200);
        console.error('[feedback] telegram error:', res.status, detail);
        failures.push(`telegram: HTTP ${res.status} ${detail}`);
      }
    } catch (e) {
      console.error('[feedback] telegram exception:', e);
      failures.push(`telegram: ${e instanceof Error ? e.message : 'network error'}`);
    }
  }

  if (smtpConfigured) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const user = process.env.SMTP_USER as string;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST as string,
        port,
        secure: port === 465,
        auth: { user, pass: process.env.SMTP_PASS as string },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      });
      await transporter.sendMail({
        from: `"Сайт 86px" <${user}>`,
        to: process.env.ADMIN_EMAIL || user,
        subject: 'Заявка с сайта 86px.ru',
        text,
        replyTo: contact.includes('@') ? contact : undefined,
      });
    } catch (e) {
      console.error('[feedback] smtp error:', e);
      failures.push(`email: ${e instanceof Error ? e.message : 'send error'}`);
    }
  }

  const channels = (tgToken && tgChat ? 1 : 0) + (smtpConfigured ? 1 : 0);
  if (failures.length >= channels) {
    console.error('[feedback] all channels failed:', failures.join(' | '));
    return NextResponse.json(
      { error: `Не удалось отправить заявку (${failures.join('; ')}). Попробуйте позже или напишите на почту.` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

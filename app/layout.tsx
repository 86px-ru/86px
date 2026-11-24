import type { Metadata } from 'next';
import CustomCursor from '@/components/CustomCursor';
import './globals.css';

export const metadata: Metadata = {
  title: '86px® — студия веб-дизайна',
  description:
    '86px — студия веб-дизайна. Проектируем и разрабатываем сайты, которые выделяют бизнес и запоминаются пользователям.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <CustomCursor />
        <div className="noise" aria-hidden="true" />
      </body>
    </html>
  );
}

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import AdminPanel from '@/components/admin/AdminPanel';
import { isAdmin } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Админка — 86px®',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login');

  return (
    <>
      <Header />
      <main className="admin">
        <div className="container">
          <AdminPanel />
        </div>
      </main>
    </>
  );
}

import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');
  return <>{children}</>;
}

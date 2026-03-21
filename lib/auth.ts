import { cookies } from 'next/headers';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_auth')?.value === 'true';
}

export function checkCredentials(user: string, pass: string): boolean {
  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
}

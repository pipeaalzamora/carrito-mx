import { NextResponse } from 'next/server';
import { checkCredentials } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_auth', 'true', { httpOnly: true, sameSite: 'lax', path: '/' });
  return res;
}

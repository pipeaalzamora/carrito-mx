'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#450A0A] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><circle cx='40' cy='40' r='12' fill='none' stroke='%23CA8A04' stroke-width='2'/><circle cx='40' cy='40' r='6' fill='%23CA8A04'/></svg>")`, backgroundSize: '80px 80px' }} />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20">
            <svg viewBox="0 0 40 48" className="w-12 h-12" fill="none">
              <ellipse cx="20" cy="20" rx="13" ry="15" fill="#FEF2F2"/>
              <ellipse cx="14" cy="18" rx="4" ry="5" fill="#1A1A1A"/>
              <ellipse cx="26" cy="18" rx="4" ry="5" fill="#1A1A1A"/>
              <ellipse cx="14" cy="18" rx="2" ry="2.5" fill="#FEF2F2"/>
              <ellipse cx="26" cy="18" rx="2" ry="2.5" fill="#FEF2F2"/>
              <path d="M13 29 Q20 35 27 29" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
              <line x1="13" y1="29" x2="27" y2="29" stroke="#1A1A1A" strokeWidth="1"/>
              <line x1="17" y1="29" x2="17" y2="33" stroke="#1A1A1A" strokeWidth="1"/>
              <line x1="20" y1="29" x2="20" y2="34" stroke="#1A1A1A" strokeWidth="1"/>
              <line x1="23" y1="29" x2="23" y2="33" stroke="#1A1A1A" strokeWidth="1"/>
              <rect x="10" y="6" width="20" height="12" rx="3" fill="#CA8A04"/>
              <ellipse cx="20" cy="18" rx="12" ry="3" fill="#A16207"/>
            </svg>
          </div>
          <h1 className="font-heading text-white text-3xl">Panel Admin</h1>
          <p className="text-white/40 text-sm mt-1">El Carrito MX</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-bold text-[#450A0A] mb-2">Usuario</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl px-4 py-3 text-[#450A0A] text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
                placeholder="admin" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#450A0A] mb-2">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl px-4 py-3 text-[#450A0A] text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
                placeholder="••••••••" />
            </div>
            {error && (
              <div className="bg-[#DC2626]/10 text-[#DC2626] text-sm font-semibold px-4 py-3 rounded-2xl mb-5 text-center">
                Usuario o contraseña incorrectos
              </div>
            )}
            <button type="submit" className="w-full bg-[#006847] hover:bg-[#004D33] text-white font-bold py-3.5 rounded-2xl transition-colors cursor-pointer text-sm tracking-wide">
              Entrar
            </button>
          </form>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="text-white/30 hover:text-white/60 text-xs transition-colors">← Volver a la carta</Link>
        </div>
      </div>
    </div>
  );
}

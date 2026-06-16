'use client';

import { useState, useEffect } from 'react';
import { adminLogin, getAdminMe } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { SITE_NAME } from '@/lib/constants';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getAdminMe().then(() => router.push('/admin/dashboard')).catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminLogin(email, password);
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md border border-white/10 p-8">
        <h1 className="font-serif text-2xl text-white">{SITE_NAME}</h1>
        <p className="mt-1 text-sm text-white/50">Admin Login</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

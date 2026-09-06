'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-cream-200/60">Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn, loading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    params.get('error') === 'unauthorised' ? 'Your account is not authorised.' : null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/logo.svg" alt="" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-cream-50 mb-2">Admin Login</h1>
          <p className="text-cream-200/60 text-sm">GauBharath Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-8 rounded-2xl bg-earth-800/40 border border-cream-100/10">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
              {error}
            </div>
          )}

          <label className="block">
            <span className="block text-cream-200/70 text-xs uppercase tracking-wider mb-2">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-earth-900/60 border border-cream-100/10 rounded-xl px-4 py-3 text-cream-50 focus:outline-none focus:border-saffron-500"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="block text-cream-200/70 text-xs uppercase tracking-wider mb-2">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-earth-900/60 border border-cream-100/10 rounded-xl px-4 py-3 text-cream-50 focus:outline-none focus:border-saffron-500"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-cream-200/40 text-xs text-center mt-6">
          Only authorised emails can access. Contact the project owner if you need access.
        </p>
      </div>
    </div>
  );
}

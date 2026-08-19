'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/auth/AuthShell';
import { useAuth } from '@/context/AuthContext';
import { demoAccount } from '@/data/auth';

export default function LoginPage() {
  const router = useRouter();
  const { user, ready, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace('/dashboard');
  }, [ready, user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push('/dashboard');
  };

  const fillDemo = () => {
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
    setError('');
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back. Use the demo account or your own signup credentials."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-brand-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder={demoAccount.email}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Enter password"
            required
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button type="submit" disabled={submitting} className="btn-gradient w-full py-3">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-brand-primary/20 bg-brand-gradient-subtle p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Demo account</p>
        <p className="mt-2 text-sm text-text-primary">
          Email: <span className="font-medium">{demoAccount.email}</span>
        </p>
        <p className="text-sm text-text-primary">
          Password: <span className="font-medium">{demoAccount.password}</span>
        </p>
        <button type="button" onClick={fillDemo} className="mt-3 text-sm font-semibold text-brand-primary hover:underline">
          Fill demo credentials
        </button>
      </div>
    </AuthShell>
  );
}

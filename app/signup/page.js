'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/auth/AuthShell';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { user, ready, signup } = useAuth();
  const [name, setName] = useState('');
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
    const result = signup({ name, email, password });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start free. No credit card required for this demo."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Alex Morgan"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@company.com"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button type="submit" disabled={submitting} className="btn-gradient w-full py-3">
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="mt-4 text-xs text-text-muted">
        Prefer a quick look?{' '}
        <Link href="/login" className="font-medium text-brand-primary hover:underline">
          Sign in with the demo account
        </Link>
        .
      </p>
    </AuthShell>
  );
}

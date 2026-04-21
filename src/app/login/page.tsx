'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus('error');
      setError(error.message);
    } else {
      setStatus('sent');
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo">A</div>
        <h1 className="login-title">Welcome to Aether</h1>
        <p className="login-sub">
          Ask one question, compare answers from every AI. Sign in with your email —
          we&apos;ll send you a magic link.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="login-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'sending' || status === 'sent'}
          />

          <button
            type="submit"
            className="login-btn"
            disabled={status === 'sending' || status === 'sent' || !email}
          >
            {status === 'sending' ? 'Sending link…' :
             status === 'sent'    ? 'Check your inbox' :
                                    'Send magic link'}
          </button>
        </form>

        {status === 'sent' && (
          <p className="login-ok">
            We sent a link to <strong>{email}</strong>. Open it to sign in.
          </p>
        )}
        {status === 'error' && error && (
          <p className="login-error">{error}</p>
        )}

        <p className="login-note">
          No password needed. Your link expires after 1 hour.
        </p>
      </div>
    </div>
  );
}

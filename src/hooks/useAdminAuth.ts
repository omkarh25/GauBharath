'use client';

import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { logger } from '@/lib/utils';

/**
 * Admin authentication hook.
 * - Listens to Firebase Auth state
 * - Restricts to a hard-coded email whitelist from env (comma-separated)
 * - Provides signIn / signOut helpers
 */
export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(!!u?.email && adminEmails.includes(u.email.toLowerCase()));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!adminEmails.includes(cred.user.email?.toLowerCase() ?? '')) {
        await fbSignOut(auth);
        throw new Error('This email is not authorised as admin.');
      }
      logger.info('Admin signed in:', cred.user.email);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await fbSignOut(auth);
    logger.info('Admin signed out');
  }

  return { user, isAdmin, loading, error, signIn, signOut };
}

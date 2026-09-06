'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/client';
import { SEED_THOUGHTS } from '@/data/seed';
import type { Thought } from '@/types';
import { logger } from '@/lib/utils';

/** Subscribe to live thoughts list, ordered by `order` field. */
export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    try {
      const q = query(collection(db(), COLLECTIONS.thoughts), orderBy('order', 'asc'));
      unsub = onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            logger.warn('No thoughts found, using seed data.');
            setThoughts(
              SEED_THOUGHTS.map((t, i) => ({
                ...t,
                id: `seed-thought-${i}`,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              })),
            );
          } else {
            setThoughts(
              snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Thought, 'id'>),
              })),
            );
          }
          setLoading(false);
        },
        (err) => {
          logger.error('Firestore thoughts error:', err);
          setError(err.message);
          setThoughts(
            SEED_THOUGHTS.map((t, i) => ({
              ...t,
              id: `seed-thought-${i}`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })),
          );
          setLoading(false);
        },
      );
    } catch (err) {
      logger.error('useThoughts init error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return { thoughts, loading, error };
}

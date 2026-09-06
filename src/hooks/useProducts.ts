'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/client';
import { SEED_PRODUCTS } from '@/data/seed';
import type { Product } from '@/types';
import { logger } from '@/lib/utils';

/**
 * Subscribe to the live product list.
 * Falls back to seed data when the collection is empty (e.g. during first run).
 */
export function useProducts(opts?: { featuredOnly?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    setLoading(true);

    try {
      const colRef = collection(db, COLLECTIONS.products);
      const constraints = opts?.featuredOnly ? [where('featured', '==', true)] : [];
      const q = query(colRef, ...constraints, orderBy('order', 'asc'));

      unsub = onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            logger.warn('No products found in Firestore, using seed data.');
            const fallback = opts?.featuredOnly
              ? SEED_PRODUCTS.filter((p) => p.featured)
              : SEED_PRODUCTS;
            setProducts(
              fallback.map((p, i) => ({
                ...p,
                id: `seed-${i}`,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                order: i,
              })),
            );
          } else {
            setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) })));
          }
          setLoading(false);
        },
        (err) => {
          logger.error('Firestore error:', err);
          setError(err.message);
          // Fallback to seeds on permission errors
          const fallback = opts?.featuredOnly
            ? SEED_PRODUCTS.filter((p) => p.featured)
            : SEED_PRODUCTS;
          setProducts(
            fallback.map((p, i) => ({
              ...p,
              id: `seed-${i}`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              order: i,
            })),
          );
          setLoading(false);
        },
      );
    } catch (err) {
      logger.error('useProducts init error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProducts(
        SEED_PRODUCTS.map((p, i) => ({
          ...p,
          id: `seed-${i}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          order: i,
        })),
      );
      setLoading(false);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [opts?.featuredOnly]);

  return { products, loading, error };
}

/** Fetch a single product by slug (used by product detail page). */
export function useProductBySlug(slug: string) {
  const { products, loading, error } = useProducts();
  const product = products.find((p) => p.slug === slug);
  return { product, loading, error };
}

/** Imperatively fetch products once (used in admin / server-side). */
export async function fetchProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, COLLECTIONS.products));
  if (snap.empty) {
    return SEED_PRODUCTS.map((p, i) => ({
      ...p,
      id: `seed-${i}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: i,
    }));
  }
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }));
}

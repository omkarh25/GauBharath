'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { db, COLLECTIONS } from '@/lib/firebase/client';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const id = (params?.id as string) ?? '';
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, COLLECTIONS.products, id), (snap) => {
      if (snap.exists()) {
        setProduct({ id: snap.id, ...(snap.data() as Omit<Product, 'id'>) });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) return <div className="text-cream-200/60">Loading product…</div>;
  if (!product) return (
    <div>
      <h1 className="font-serif text-2xl text-cream-50 mb-4">Product not found</h1>
      <Link href="/admin/products" className="btn-secondary">Back</Link>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 text-sm text-cream-200/60 mb-3">
        <Link href="/admin/products" className="hover:text-saffron-400">Products</Link>
        <span>/</span>
        <span className="truncate">{product.titleEn}</span>
      </div>
      <h1 className="font-serif text-3xl text-cream-50 mb-6">Edit Product</h1>
      <div className="p-6 rounded-2xl bg-earth-800/40 border border-cream-100/10">
        <ProductForm initial={product} onSaved={() => router.push('/admin/products')} />
      </div>
    </div>
  );
}

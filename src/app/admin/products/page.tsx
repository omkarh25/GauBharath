'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/client';
import { formatINR } from '@/lib/utils';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTIONS.products), (s) => {
      setProducts(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.titleEn}"? This cannot be undone.`)) return;
    setDeleting(p.id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.products, p.id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-cream-50">Products</h1>
          <p className="text-cream-200/60 text-sm mt-1">{products.length} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl shimmer bg-earth-800/40" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-cream-200/60 border border-dashed border-cream-100/10 rounded-2xl">
          No products yet. Click &ldquo;Add Product&rdquo; to begin.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cream-100/10 bg-earth-800/30">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-cream-200/60 border-b border-cream-100/10">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4 hidden md:table-cell">Category</th>
                <th className="text-right p-4">Price</th>
                <th className="text-center p-4 hidden md:table-cell">Stock</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-cream-100/5 last:border-0 hover:bg-earth-700/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-earth-900 flex-shrink-0">
                        <Image src={p.imageUrl} alt={p.titleEn} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-cream-50 truncate">{p.titleEn}</div>
                        <div className="text-cream-200/50 text-xs truncate">{p.titleKn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-cream-100/10 text-cream-200">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 text-right text-saffron-400">{formatINR(p.price)}</td>
                  <td className="p-4 text-center hidden md:table-cell">
                    {p.inStock ? (
                      <span className="text-forest-300">●</span>
                    ) : (
                      <span className="text-red-400">○</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="px-3 py-1.5 rounded-lg bg-cream-100/10 hover:bg-cream-100/20 text-cream-100 text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs disabled:opacity-50"
                      >
                        {deleting === p.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

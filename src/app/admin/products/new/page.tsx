'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center gap-3 text-sm text-cream-200/60 mb-3">
        <Link href="/admin/products" className="hover:text-saffron-400">Products</Link>
        <span>/</span>
        <span>New</span>
      </div>
      <h1 className="font-serif text-3xl text-cream-50 mb-6">Add Product</h1>
      <div className="p-6 rounded-2xl bg-earth-800/40 border border-cream-100/10">
        <ProductForm onSaved={() => router.push('/admin/products')} />
      </div>
    </div>
  );
}

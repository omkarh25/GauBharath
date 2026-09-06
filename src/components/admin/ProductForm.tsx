'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/client';
import { slugify, generateId, logger } from '@/lib/utils';
import type { Product, ProductCategory } from '@/types';

const categories: ProductCategory[] = ['dhoop', 'lamp', 'cake', 'oil', 'soap', 'tea', 'wellness', 'other'];

interface ProductFormProps {
  initial?: Product;
  onSaved?: (id: string) => void;
}

export function ProductForm({ initial, onSaved }: ProductFormProps) {
  const [form, setForm] = useState({
    titleEn: initial?.titleEn ?? '',
    titleKn: initial?.titleKn ?? '',
    slug: initial?.slug ?? '',
    descriptionEn: initial?.descriptionEn ?? '',
    price: initial?.price ?? 0,
    originalPrice: initial?.originalPrice ?? 0,
    category: initial?.category ?? 'wellness',
    imageUrl: initial?.imageUrl ?? '/assets/products/oil.svg',
    inStock: initial?.inStock ?? true,
    featured: initial?.featured ?? false,
    benefitsText: initial?.benefits?.join('\n') ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const id = initial?.id ?? generateId();
      const slug = form.slug.trim() || slugify(form.titleEn);
      const benefits = form.benefitsText.split('\n').map((s) => s.trim()).filter(Boolean);
      const data: Omit<Product, 'id'> = {
        slug,
        titleEn: form.titleEn.trim(),
        titleKn: form.titleKn.trim(),
        descriptionEn: form.descriptionEn.trim(),
        price: Number(form.price) || 0,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category: form.category,
        imageUrl: form.imageUrl.trim(),
        inStock: form.inStock,
        featured: form.featured,
        benefits: benefits.length > 0 ? benefits : undefined,
        createdAt: initial?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
        order: initial?.order ?? 0,
      };

      await setDoc(doc(db(), COLLECTIONS.products, id), data);
      logger.info('Product saved:', id);
      onSaved?.(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      logger.error('Product save error:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title (English)" required>
          <input required value={form.titleEn} onChange={(e) => update('titleEn', e.target.value)} onBlur={() => !form.slug && update('slug', slugify(form.titleEn))} className="adm-input" />
        </Field>
        <Field label="Title (Kannada)">
          <input value={form.titleKn} onChange={(e) => update('titleKn', e.target.value)} className="adm-input" />
        </Field>
      </div>

      <Field label="Slug (URL)">
        <input value={form.slug} onChange={(e) => update('slug', e.target.value)} className="adm-input" placeholder="auto-generated from title" />
      </Field>

      <Field label="Description" required>
        <textarea required rows={4} value={form.descriptionEn} onChange={(e) => update('descriptionEn', e.target.value)} className="adm-input" />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Price (INR)" required>
          <input type="number" required min={0} value={form.price} onChange={(e) => update('price', Number(e.target.value))} className="adm-input" />
        </Field>
        <Field label="Original Price (INR)">
          <input type="number" min={0} value={form.originalPrice} onChange={(e) => update('originalPrice', Number(e.target.value))} className="adm-input" />
        </Field>
        <Field label="Category" required>
          <select value={form.category} onChange={(e) => update('category', e.target.value as ProductCategory)} className="adm-input">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Image URL" required>
        <input required value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} className="adm-input" />
        {form.imageUrl && (
          <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden bg-earth-900">
            <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </Field>

      <Field label="Benefits (one per line)">
        <textarea rows={3} value={form.benefitsText} onChange={(e) => update('benefitsText', e.target.value)} className="adm-input" placeholder={'Purifies air\nAids meditation'} />
      </Field>

      <div className="flex items-center gap-6">
        <Checkbox label="In Stock" checked={form.inStock} onChange={(v) => update('inStock', v)} />
        <Checkbox label="Featured" checked={form.featured} onChange={(v) => update('featured', v)} />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-cream-100/10">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Product'}
        </button>
      </div>

      <style jsx>{`
        :global(.adm-input) {
          width: 100%;
          background-color: rgba(58, 36, 16, 0.6);
          border: 1px solid rgba(245, 230, 211, 0.1);
          border-radius: 0.75rem;
          padding: 0.625rem 1rem;
          color: rgb(245, 230, 211);
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.adm-input:focus) { border-color: #D2691E; }
      `}</style>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-cream-200/70 text-xs uppercase tracking-wider mb-2">
        {label} {required && <span className="text-saffron-400">*</span>}
      </span>
      {children}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-saffron-500" />
      <span className="text-cream-100 text-sm">{label}</span>
    </label>
  );
}

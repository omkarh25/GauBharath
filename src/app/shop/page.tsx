'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/shop/ProductCard';
import { RevealText } from '@/components/motion/RevealText';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types';

const categories: { value: ProductCategory | 'all'; label: string; kn: string }[] = [
  { value: 'all', label: 'All', kn: 'ಎಲ್ಲಾ' },
  { value: 'dhoop', label: 'Dhoop', kn: 'ಧೂಪ' },
  { value: 'lamp', label: 'Lamps', kn: 'ಹಬ್ಬತಿ' },
  { value: 'cake', label: 'Cakes', kn: 'ಖಿಂಡ' },
  { value: 'oil', label: 'Oils', kn: 'ತೈಲ' },
  { value: 'soap', label: 'Soaps', kn: 'ಸೋಪ್' },
  { value: 'tea', label: 'Tea', kn: 'ಟೀ' },
  { value: 'wellness', label: 'Wellness', kn: 'ಆರೋಗ್ಯ' },
];

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name';

export default function ShopPage() {
  const { products, loading } = useProducts();
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('default');

  const filtered = useMemo(() => {
    let list = products;
    if (category !== 'all') list = list.filter((p) => p.category === category);
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        list = [...list].sort((a, b) => a.titleEn.localeCompare(b.titleEn));
        break;
    }
    return list;
  }, [products, category, sort]);

  return (
    <div className="pt-32 pb-12">
      {/* Header */}
      <div className="container-wide px-6 md:px-12 mb-12">
        <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4 text-center">
          Shop
        </div>
        <RevealText
          as="h1"
          className="font-serif text-5xl md:text-7xl text-cream-50 leading-tight text-center mb-4"
        >
          The GauBharath Shop
        </RevealText>
        <p className="text-center text-cream-200/60 max-w-2xl mx-auto">
          Sacred, handmade products from our gau shala. Each item is prepared with devotion
          and offered with love.
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-30 bg-earth-900/80 backdrop-blur-md border-y border-cream-100/10 mb-12">
        <div className="container-wide px-6 md:px-12 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto -mx-2 px-2 pb-2 md:pb-0 scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all',
                  category === c.value
                    ? 'bg-saffron-500 text-white'
                    : 'bg-cream-100/5 text-cream-200 hover:bg-cream-100/10',
                )}
              >
                {c.label}
                <span className="ml-1.5 text-xs opacity-60">{c.kn}</span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 text-sm text-cream-200">
            <label htmlFor="sort" className="text-cream-200/60">Sort:</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-earth-800 border border-cream-100/10 rounded-full px-4 py-2 text-cream-100 focus:outline-none focus:border-saffron-500"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-wide px-6 md:px-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl shimmer bg-earth-800/40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-cream-200/60">
            No products in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

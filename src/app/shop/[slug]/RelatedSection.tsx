'use client';

import { RevealText } from '@/components/motion/RevealText';
import { ProductCard } from '@/components/shop/ProductCard';
import type { Product } from '@/types';

export function RelatedSection({ related }: { related: Product[] }) {
  if (related.length === 0) return null;
  return (
    <div className="container-wide px-6 md:px-12">
      <RevealText as="h2" className="font-serif text-3xl md:text-4xl text-cream-50 mb-8 text-center">
        You may also like
      </RevealText>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

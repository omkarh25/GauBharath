'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cartStore';
import { formatINR, discountPercent } from '@/lib/utils';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const add = useCart((s) => s.add);
  const discount = discountPercent(product.price, product.originalPrice);

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    add(product, 1);
    setTimeout(() => setAdding(false), 600);
  }

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn('card group block relative', className)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-earth-900">
        <Image
          src={product.imageUrl}
          alt={product.titleEn}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-transparent to-transparent" />

        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-saffron-500 text-white text-[10px] tracking-wider uppercase font-medium px-2 py-1 rounded-full">
            {discount}% Off
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="font-serif text-cream-50 text-lg tracking-wider">Out of Stock</span>
          </div>
        )}

        {/* Quick add */}
        {product.inStock && (
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              'absolute bottom-3 right-3 w-10 h-10 rounded-full bg-cream-50 text-earth-900 flex items-center justify-center transition-all duration-300',
              adding ? 'scale-125 bg-forest-300' : 'hover:bg-saffron-400 hover:scale-110',
            )}
            aria-label={`Add ${product.titleEn} to cart`}
          >
            {adding ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-[10px] tracking-[0.3em] uppercase text-saffron-300 mb-2">
          {product.category}
        </div>
        <h3 className="font-serif text-lg text-cream-50 leading-tight mb-1 line-clamp-2">
          {product.titleEn}
        </h3>
        <p className="font-kannada text-sm text-cream-200/70 mb-3">{product.titleKn}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-xl text-saffron-400">{formatINR(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-cream-200/40 line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

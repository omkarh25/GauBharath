'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProductBySlug, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/store/cartStore';
import { formatINR, discountPercent, cn } from '@/lib/utils';
import { RelatedSection } from './RelatedSection';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) ?? '';
  const { product, loading } = useProductBySlug(slug);
  const { products } = useProducts();
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => setQuantity(1), [slug]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <ProductNotFound />;

  const discount = discountPercent(product.price, product.originalPrice);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  function handleAdd() {
    if (!product) return;
    add(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="pt-28 pb-12">
      <div className="container-wide px-6 md:px-12 mb-6 text-sm text-cream-200/60">
        <Link href="/" className="hover:text-saffron-400">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-saffron-400">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-cream-200">{product.titleEn}</span>
      </div>

      <div className="container-wide px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-cream-100/10 bg-earth-900">
          <Image src={product.imageUrl} alt={product.titleEn} fill priority className="object-cover" />
          {discount > 0 && (
            <div className="absolute top-6 left-6 bg-saffron-500 text-white text-xs tracking-wider uppercase font-medium px-3 py-1.5 rounded-full">
              {discount}% Off
            </div>
          )}
        </div>

        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-saffron-300 mb-3">{product.category}</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream-50 leading-tight mb-2">{product.titleEn}</h1>
          <p className="font-kannada text-2xl text-gradient-saffron mb-6">{product.titleKn}</p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-serif text-4xl text-saffron-400">{formatINR(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-lg text-cream-200/40 line-through">{formatINR(product.originalPrice)}</span>
                <span className="text-forest-300 text-sm">{discount}% off</span>
              </>
            )}
          </div>

          <p className="text-cream-200/80 leading-relaxed mb-8">{product.descriptionEn}</p>

          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-8">
              <h3 className="font-serif text-cream-50 text-lg mb-3">Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-cream-200/80">
                    <span className="text-saffron-400">✓</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center bg-earth-800 rounded-full border border-cream-100/10">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 text-cream-100 hover:text-saffron-400">−</button>
              <span className="w-10 text-center text-cream-50">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 text-cream-100 hover:text-saffron-400">+</button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock}
              className={cn(
                'flex-1 px-6 py-3 rounded-full font-medium tracking-wide transition-all',
                added ? 'bg-forest-400 text-white' : 'bg-saffron-500 hover:bg-saffron-400 text-white hover:shadow-[0_8px_24px_rgba(210,105,30,0.4)]',
                !product.inStock && 'opacity-50 cursor-not-allowed',
              )}
            >
              {added ? '✓ Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-cream-200/60">
            <div className="p-3 rounded-xl bg-earth-800/40 border border-cream-100/10 text-center">
              <div className="text-saffron-400 text-base mb-1">🌿</div>100% Natural
            </div>
            <div className="p-3 rounded-xl bg-earth-800/40 border border-cream-100/10 text-center">
              <div className="text-saffron-400 text-base mb-1">🙏</div>Handmade
            </div>
            <div className="p-3 rounded-xl bg-earth-800/40 border border-cream-100/10 text-center">
              <div className="text-saffron-400 text-base mb-1">🚚</div>Pan-India
            </div>
          </div>
        </div>
      </div>

      <RelatedSection related={related} />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="pt-32 pb-12 container-wide px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-3xl shimmer bg-earth-800/40" />
        <div className="space-y-4">
          <div className="h-8 w-1/3 shimmer rounded bg-earth-800/40" />
          <div className="h-12 w-2/3 shimmer rounded bg-earth-800/40" />
          <div className="h-32 shimmer rounded-2xl bg-earth-800/40" />
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="pt-32 pb-12 container-narrow px-6 text-center">
      <h1 className="font-serif text-3xl text-cream-50 mb-4">Product not found</h1>
      <Link href="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  );
}

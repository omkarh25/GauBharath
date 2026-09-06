'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/shop/ProductCard';
import { RevealText } from '@/components/motion/RevealText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function FeaturedProducts() {
  const { products, loading } = useProducts({ featuredOnly: true });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.featured-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [products]);

  return (
    <section ref={ref} className="section">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">Curated</div>
            <RevealText as="h2" className="font-serif text-4xl md:text-5xl text-cream-50 leading-tight">
              Featured Offerings
            </RevealText>
          </div>
          <Link
            href="/shop"
            className="text-saffron-400 hover:text-saffron-300 transition-colors text-sm tracking-wider uppercase"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl shimmer bg-earth-800/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((p) => (
              <div key={p.id} className="featured-card">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

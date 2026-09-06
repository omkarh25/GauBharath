'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useThoughts } from '@/hooks/useThoughts';
import { RevealText } from '@/components/motion/RevealText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ThoughtsTeaser() {
  const { thoughts, loading } = useThoughts();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.thought-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [thoughts]);

  const preview = thoughts.slice(0, 2);

  return (
    <section ref={ref} className="section relative overflow-hidden">
      {/* Background mandala */}
      <img
        src="/assets/patterns/mandala.svg"
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04] pointer-events-none"
      />

      <div className="container-narrow relative">
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">Wisdom</div>
          <RevealText as="h2" className="font-serif text-4xl md:text-5xl text-cream-50 leading-tight">
            Thoughts from Modaksha
          </RevealText>
          <p className="text-cream-200/60 mt-4 max-w-xl mx-auto">
            Short reflections on Dharma, Gau Seva, and the inner journey.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl shimmer bg-earth-800/40" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {preview.map((t, i) => (
              <div
                key={t.id}
                className="thought-card p-8 md:p-10 rounded-3xl bg-gradient-to-br from-earth-800/60 to-earth-900/40 border border-cream-100/10 backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-saffron-500/10 blur-3xl" />
                <div className="relative">
                  <div className="text-6xl text-saffron-400/30 font-serif leading-none mb-4">"</div>
                  <p className="font-serif text-2xl md:text-3xl text-cream-50 leading-snug mb-4">
                    {t.text}
                  </p>
                  <div className="text-saffron-300 text-sm tracking-wider uppercase">— {t.author}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/thoughts" className="btn-secondary">
            Enter the Thoughts →
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/motion/MagneticButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      // Initial entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        bgRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6 },
        0,
      )
        .fromTo(
          '.hero-word',
          { y: 80, opacity: 0, rotateX: -90 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.08 },
          0.3,
        )
        .fromTo(
          subtextRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          0.8,
        )
        .fromTo(
          ctaRef.current?.children ?? [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          1,
        )
        .fromTo(
          '.hero-om',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.6)' },
          0.5,
        );

      // Parallax on background
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Fade content on scroll
      gsap.to(headlineRef.current, {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const headline = 'GauBharath';
  const subline = 'ಗೋಭಾರತ್';

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grain"
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[5%] -bottom-[10%]"
        style={{
          backgroundImage: 'url(/assets/hero/hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          willChange: 'transform',
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/60" />

      {/* Decorative mandalas */}
      <img
        src="/assets/patterns/mandala.svg"
        alt=""
        className="absolute top-20 -right-32 w-96 h-96 opacity-10 animate-spin-slow pointer-events-none"
        style={{ animation: 'spin 120s linear infinite' }}
      />
      <img
        src="/assets/patterns/mandala.svg"
        alt=""
        className="absolute -bottom-32 -left-32 w-96 h-96 opacity-10 pointer-events-none"
        style={{ animation: 'spin 180s linear infinite reverse' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-12">
        <div className="hero-om text-6xl text-saffron-400 mb-6 font-serif">ॐ</div>

        <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-saffron-300 mb-6">
          A Sacred Endeavour
        </p>

        <h1
          ref={headlineRef}
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-cream-50 leading-[0.95] tracking-tight mb-4"
          style={{ perspective: '1000px' }}
        >
          {headline.split('').map((ch, i) => (
            <span key={i} className="hero-word inline-block" style={{ transformOrigin: 'center bottom' }}>
              {ch}
            </span>
          ))}
        </h1>

        <p className="font-kannada text-3xl md:text-4xl text-gradient-saffron mb-6">{subline}</p>

        <p
          ref={subtextRef}
          className="text-cream-200/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Gau Seva · Gau Preethi · Gau Sanga — handmade dhoop, sacred oils, herbal soaps and more,
          offered with love from our shala in Mangaluru.
        </p>

        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <Link href="/shop" className="btn-primary text-base">
              Explore Shop
              <span aria-hidden>→</span>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/thoughts" className="btn-secondary text-base">
              Read Thoughts
            </Link>
          </MagneticButton>
        </div>

        {/* Scroll indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 opacity-60">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-cream-200 to-transparent" />
          <div className="text-[10px] tracking-[0.3em] uppercase text-cream-200/60 mt-2">Scroll</div>
        </div>
      </div>
    </section>
  );
}

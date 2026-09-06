'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealText } from '@/components/motion/RevealText';
import { ParallaxImage } from '@/components/motion/ParallaxImage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function MissionSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Pinned horizontal scroll effect
      const pinEl = ref.current!.querySelector('.pin-wrap');
      if (!pinEl) return;

      // Simple reveal — full pin can be heavy; we keep a softer version here
      gsap.fromTo(
        '.mission-img',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top 75%',
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section relative">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pin-wrap">
          <div className="mission-img relative aspect-[4/5] rounded-3xl overflow-hidden border border-cream-100/10 shadow-2xl">
            <ParallaxImage
              src="/assets/hero/hero.jpeg"
              alt="Founder with cows at GauBharath shala"
              className="absolute inset-0 w-full h-full"
              speed={0.4}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-saffron-300 text-xs tracking-[0.3em] uppercase mb-2">The Founder</div>
              <div className="font-serif text-2xl text-cream-50">Modaksha</div>
            </div>
          </div>

          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">Our Mission</div>
            <RevealText as="h2" className="font-serif text-4xl md:text-5xl text-cream-50 leading-tight mb-6">
              Gau Seva is Dharma Seva
            </RevealText>

            <div className="space-y-4 text-cream-200/80 leading-relaxed">
              <p>
                GauBharath is more than a brand — it is a way of life. We believe that the cow
                (Go-Matha) is the mother of all prosperity, and to serve her is to serve the
                universe itself.
              </p>
              <p>
                Every product we offer is crafted by hand at our shala in Mangaluru, using
                traditional methods passed down through generations. From sacred dhoop
                to herbal oils, each item carries the blessings of the cow and the
                devotion of our team.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              <div>
                <div className="font-serif text-3xl text-saffron-400">17+</div>
                <div className="text-cream-200/60 text-xs mt-1 uppercase tracking-wider">Products</div>
              </div>
              <div>
                <div className="font-serif text-3xl text-saffron-400">100%</div>
                <div className="text-cream-200/60 text-xs mt-1 uppercase tracking-wider">Natural</div>
              </div>
              <div>
                <div className="font-serif text-3xl text-saffron-400">24/7</div>
                <div className="text-cream-200/60 text-xs mt-1 uppercase tracking-wider">Open</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

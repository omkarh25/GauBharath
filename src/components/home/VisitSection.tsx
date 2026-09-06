'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealText } from '@/components/motion/RevealText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const products = [
  { name: 'Agni Hotra Dhoop', price: 70 },
  { name: 'Gomaya Lamp', price: 3 },
  { name: 'Cow Dung Cake', price: 80 },
  { name: 'Arjuna Tea', price: 200 },
  { name: 'Ksheera Kranthi Soap', price: 60 },
];

export function VisitSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ticker-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section relative border-t border-cream-100/10">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">Visit</div>
            <RevealText as="h2" className="font-serif text-4xl md:text-5xl text-cream-50 leading-tight mb-6">
              Come to our Shala
            </RevealText>

            <p className="text-cream-200/70 leading-relaxed mb-8 max-w-md">
              Our gau shala is open around the clock. Bring your offerings, spend time with the
              cows, and take home something sacred.
            </p>

            <ul className="space-y-4 text-cream-100">
              <li className="flex items-start gap-3">
                <span className="text-saffron-400 mt-1">📍</span>
                <div>
                  <div className="font-medium">Maarigudi Road, Mangaluru 575014</div>
                  <div className="text-cream-200/60 text-sm">Karnataka, India</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-saffron-400 mt-1">🕉</span>
                <div>
                  <div className="font-medium text-forest-300">Open 24 hours</div>
                  <div className="text-cream-200/60 text-sm">All days of the week</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-saffron-400 mt-1">🙏</span>
                <div>
                  <div className="font-medium">Gau Seva &amp; Gau Darshan</div>
                  <div className="text-cream-200/60 text-sm">Visit the cows, offer seva</div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">Quick Picker</div>
            <RevealText as="h3" className="font-serif text-2xl text-cream-50 mb-6">
              Sacred essentials from ₹3
            </RevealText>

            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => (
                <a
                  key={p.name}
                  href="/shop"
                  className="ticker-item p-4 rounded-xl border border-cream-100/10 bg-earth-800/30 hover:bg-earth-800/60 hover:border-saffron-500/40 transition-all"
                >
                  <div className="text-cream-50 text-sm font-serif">{p.name}</div>
                  <div className="text-saffron-400 text-sm mt-1">from ₹{p.price}</div>
                </a>
              ))}
            </div>

            <a href="/shop" className="btn-primary w-full mt-6">
              Visit Shop
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

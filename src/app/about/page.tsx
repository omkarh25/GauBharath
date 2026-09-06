'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealText } from '@/components/motion/RevealText';
import { ParallaxImage } from '@/components/motion/ParallaxImage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const values = [
  {
    title: 'Gau Seva',
    kn: 'ಗೋ ಸೇವೆ',
    description: 'Service to the cow is service to the universe. Every cow at our shala is cared for with devotion.',
    icon: '🙏',
  },
  {
    title: 'Gau Preethi',
    kn: 'ಗೋ ಪ್ರೀತಿ',
    description: 'A love that flows from reverence. We believe in the cow as Go-Matha — the mother of all.',
    icon: '❤️',
  },
  {
    title: 'Gau Sanga',
    kn: 'ಗೋ ಸಂಗ',
    description: 'Being in the company of cows brings peace, purity and grace to the mind and heart.',
    icon: '🌿',
  },
];

// Modaksha's social channels
const MODAKSHA_INSTAGRAM = 'https://www.instagram.com/el_do_rado2.0?stkn=MTRsdTByaHF1bnU4Mw==';
const MODAKSHA_YOUTUBE = 'https://youtube.com/@colourfullworld6794?si=4v_yMh-WGBvEgoXr';

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.value-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-28 pb-12">
      <section className="section">
        <div className="container-wide">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">Our Story</div>
            <RevealText as="h1" className="font-serif text-5xl md:text-7xl text-cream-50 leading-tight mb-6">
              About GauBharath
            </RevealText>
            <p className="text-cream-200/70 max-w-2xl mx-auto text-lg leading-relaxed">
              A small shala on the outskirts of Mangaluru, where every day begins with the cow
              and every product carries her blessing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <ParallaxImage
              src="/assets/hero/hero.jpeg"
              alt="Modaksha with cows at the shala"
              className="aspect-[4/5] rounded-3xl border border-cream-100/10"
              speed={0.4}
            />
            <div>
              <div className="text-saffron-300 text-xs tracking-[0.4em] uppercase mb-4">The Founder</div>
              <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-2">Modaksha</h2>
              <p className="font-kannada text-2xl text-gradient-saffron mb-6">ಮೊದಕ್ಷ</p>
              <p className="text-cream-200/80 leading-relaxed mb-4">
                Modaksha is a devotee of Go-Matha whose life is dedicated to the service and
                protection of cows. The shala at Maarigudi Road is his ashram — a place where
                cows are honoured, traditions are kept, and seekers come to find peace.
              </p>
              <p className="text-cream-200/80 leading-relaxed">
                Every product from GauBharath — from the dhoop that purifies air to the oils that
                heal the body — is prepared by hand at the shala, with the same care that has
                been passed down for generations.
              </p>

              {/* Connect with Modaksha */}
              <div className="mt-8 pt-6 border-t border-cream-100/10">
                <div className="text-cream-200/60 text-xs tracking-[0.3em] uppercase mb-3">
                  Connect with Modaksha
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={MODAKSHA_INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Modaksha on Instagram"
                    className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-cream-100/15 bg-earth-800/40 hover:border-saffron-400 hover:bg-earth-800/70 transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-saffron-400" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                    <span className="text-cream-100 text-sm group-hover:text-saffron-300 transition-colors">Instagram</span>
                  </a>
                  <a
                    href={MODAKSHA_YOUTUBE}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Modaksha on YouTube"
                    className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-cream-100/15 bg-earth-800/40 hover:border-saffron-400 hover:bg-earth-800/70 transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-saffron-400" aria-hidden>
                      <rect x="2" y="5" width="20" height="14" rx="3" />
                      <path d="M10 9 L15 12 L10 15 Z" fill="currentColor" stroke="none" />
                    </svg>
                    <span className="text-cream-100 text-sm group-hover:text-saffron-300 transition-colors">YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={ref} className="section bg-earth-900/30 border-y border-cream-100/5">
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">What We Live By</div>
            <RevealText as="h2" className="font-serif text-4xl md:text-5xl text-cream-50 leading-tight">
              Three Sacred Words
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="value-card p-8 rounded-3xl bg-gradient-to-br from-earth-800/60 to-earth-900/40 border border-cream-100/10 text-center hover:border-saffron-500/40 transition-all"
              >
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="font-serif text-2xl text-cream-50 mb-1">{v.title}</h3>
                <p className="font-kannada text-lg text-saffron-300 mb-4">{v.kn}</p>
                <p className="text-cream-200/70 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">Visit</div>
            <RevealText as="h2" className="font-serif text-4xl md:text-5xl text-cream-50 mb-6">
              Come to our Shala
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-earth-800/40 border border-cream-100/10">
              <div className="text-saffron-400 mb-2">📍 Address</div>
              <div className="text-cream-100">Maarigudi Road, Mangaluru 575014</div>
              <div className="text-cream-200/60 text-sm">Karnataka, India</div>
            </div>
            <div className="p-6 rounded-2xl bg-earth-800/40 border border-cream-100/10">
              <div className="text-saffron-400 mb-2">🕉 Hours</div>
              <div className="text-forest-300 font-medium">Open 24 hours</div>
              <div className="text-cream-200/60 text-sm">All days of the week</div>
            </div>
          </div>

          <div className="text-center mt-10 text-cream-200/60 text-sm">
            For visits, seva enquiries or to bring offerings, please reach out via the Shop page or
            contact the shala directly.
          </div>
        </div>
      </section>
    </div>
  );
}

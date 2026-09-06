'use client';

import { useState } from 'react';
import { useThoughts } from '@/hooks/useThoughts';
import { ThoughtPlayer } from '@/components/thoughts/ThoughtPlayer';
import { RevealText } from '@/components/motion/RevealText';

export default function ThoughtsPage() {
  const { thoughts, loading } = useThoughts();
  const [playerOpen, setPlayerOpen] = useState(false);

  if (playerOpen) {
    return <ThoughtPlayer onExit={() => setPlayerOpen(false)} />;
  }

  return (
    <div className="pt-32 pb-12 min-h-screen relative overflow-hidden">
      {/* Mandala background */}
      <img
        src="/assets/patterns/mandala.svg"
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.04] pointer-events-none"
      />

      <div className="container-narrow px-6 md:px-12 relative">
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.4em] uppercase text-saffron-400 mb-4">
            Reflections
          </div>
          <RevealText
            as="h1"
            className="font-serif text-5xl md:text-7xl text-cream-50 leading-tight mb-6"
          >
            Thoughts
          </RevealText>
          <p className="text-cream-200/60 max-w-xl mx-auto text-lg leading-relaxed">
            Short meditations on Dharma, Gau Seva, and the inner journey —
            shared by <span className="text-saffron-300">Modaksha</span>.
          </p>
        </div>

        {/* Entry CTA */}
        <div className="text-center mb-20">
          <button
            type="button"
            onClick={() => setPlayerOpen(true)}
            disabled={loading || thoughts.length === 0}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-saffron-500 hover:bg-saffron-400 text-white text-lg tracking-wider transition-all duration-300 hover:shadow-[0_0_60px_rgba(210,105,30,0.5)] disabled:opacity-50"
          >
            <span className="font-serif">Enter the Thoughts</span>
            <span className="text-2xl transition-transform group-hover:translate-x-2">→</span>
          </button>
          <p className="text-cream-200/40 text-xs tracking-wider uppercase mt-4">
            Full-screen experience
          </p>
        </div>

        {/* All thoughts list */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl shimmer bg-earth-800/40" />
            ))
          ) : (
            thoughts.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPlayerOpen(true)}
                className="w-full text-left p-8 rounded-2xl bg-gradient-to-br from-earth-800/60 to-earth-900/40 border border-cream-100/10 backdrop-blur-sm hover:border-saffron-500/40 hover:shadow-[0_0_40px_rgba(210,105,30,0.2)] transition-all duration-500 group"
              >
                <div className="flex items-start gap-6">
                  <div className="font-serif text-5xl text-saffron-400/40 group-hover:text-saffron-400 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-xl md:text-2xl text-cream-50 leading-snug mb-3">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="text-saffron-300/80 text-xs tracking-wider uppercase">
                      — {t.author}
                    </div>
                  </div>
                  <div className="self-center text-saffron-400 text-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                    →
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

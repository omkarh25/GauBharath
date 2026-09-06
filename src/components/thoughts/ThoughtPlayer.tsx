'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useThoughts } from '@/hooks/useThoughts';

const BGM_SRC = '/assets/audio/tatvam-niramaya.mp3';

interface ThoughtPlayerProps {
  onExit: () => void;
}

/**
 * Full-screen cinematic presentation of thoughts.
 * - Background image crossfades + Ken-Burns zoom
 * - Quote words animate in one-by-one with a GSAP timeline
 * - Tatvam Niramaya plays as ambient BGM (on by default, toggle via the speaker button)
 * - Sequential navigation via click, arrows, or auto-advance
 */
export function ThoughtPlayer({ onExit }: ThoughtPlayerProps) {
  const { thoughts, loading } = useThoughts();
  const [index, setIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [bgmPlaying, setBgmPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const current = thoughts[index];

  // ---------- BGM ----------
  // Tatvam Niramaya loops as ambient background music while the player is open.
  // BGM is on by default; user can mute via the speaker button. Autoplay may be
  // blocked by the browser — in that case the user can resume via the button.
  useEffect(() => {
    if (!current) return;
    const audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.volume = 0.6;
    audio.preload = 'auto';
    bgmRef.current = audio;

    const tryPlay = async () => {
      try {
        await audio.play();
        setBgmPlaying(true);
      } catch {
        // Autoplay blocked — leave the user opted-in; the toggle resumes it.
        setBgmPlaying(true);
      }
    };
    tryPlay();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      bgmRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleBgm = useCallback(() => {
    const a = bgmRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setBgmPlaying(true)).catch(() => setBgmPlaying(false));
    } else {
      a.pause();
      setBgmPlaying(false);
    }
  }, []);

  // ---------- Animations ----------
  const animateIn = useCallback(() => {
    if (!textRef.current || !bgRef.current) return;
    const words = textRef.current.querySelectorAll<HTMLSpanElement>('.thought-word');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    gsap.fromTo(
      bgRef.current,
      { scale: 1, x: 0, y: 0 },
      { scale: 1.15, x: '-2%', y: '-2%', duration: 14, ease: 'sine.inOut' },
    );

    if (authorRef.current) {
      tl.fromTo(authorRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 0);
    }

    if (words.length > 0) {
      tl.fromTo(
        words,
        { opacity: 0, y: 60, rotateX: -60 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.12 },
        0.2,
      );
    }
  }, []);

  const animateOut = useCallback((onComplete: () => void) => {
    if (!textRef.current) return onComplete();
    const words = textRef.current.querySelectorAll<HTMLSpanElement>('.thought-word');
    gsap.to(words, {
      opacity: 0,
      y: -40,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power3.in',
      onComplete,
    });
    if (authorRef.current) {
      gsap.to(authorRef.current, { opacity: 0, duration: 0.4 });
    }
  }, []);

  useEffect(() => {
    if (!current) return;
    gsap.killTweensOf([bgRef.current, textRef.current, authorRef.current]);
    animateIn();
  }, [current, animateIn]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') return onExit();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key.toLowerCase() === 'm') toggleBgm();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExit, thoughts.length, toggleBgm]);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  function goNext() {
    if (isAdvancing || !thoughts.length) return;
    setIsAdvancing(true);
    animateOut(() => {
      setIndex((i) => (i + 1) % thoughts.length);
      setIsAdvancing(false);
    });
  }

  function goPrev() {
    if (isAdvancing || !thoughts.length) return;
    setIsAdvancing(true);
    animateOut(() => {
      setIndex((i) => (i - 1 + thoughts.length) % thoughts.length);
      setIsAdvancing(false);
    });
  }

  function jumpTo(i: number) {
    if (isAdvancing || i === index) return;
    setIsAdvancing(true);
    animateOut(() => {
      setIndex(i);
      setIsAdvancing(false);
    });
  }

  if (loading) {
    return (
      <div ref={containerRef} className="fixed inset-0 z-[100] bg-ink flex items-center justify-center">
        <div className="text-saffron-400 font-serif text-2xl animate-pulse">Loading thoughts…</div>
      </div>
    );
  }

  if (!thoughts.length) {
    return (
      <div className="fixed inset-0 z-[100] bg-ink flex items-center justify-center text-center px-6">
        <div>
          <p className="text-cream-50 font-serif text-2xl mb-6">No thoughts to share yet.</p>
          <button onClick={onExit} className="btn-secondary">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] overflow-hidden bg-ink">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: current.backgroundUrl ? `url(${current.backgroundUrl})` : 'none',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink" />
      </div>

      <ParticleField />

      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-6 md:p-10">
        <div className="text-cream-100/80 text-xs tracking-[0.3em] uppercase">
          <span className="text-saffron-400 font-serif text-base">&#2381;&#2359;</span>
          <span className="ml-3">Thought {index + 1} of {thoughts.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleBgm}
            aria-label={bgmPlaying ? 'Mute BGM' : 'Play BGM'}
            aria-pressed={bgmPlaying}
            title={bgmPlaying ? 'Mute (M)' : 'Play BGM (M)'}
            className={`group flex items-center gap-2 text-cream-100/80 hover:text-cream-50 text-xs tracking-[0.3em] uppercase transition-colors ${
              bgmPlaying ? 'text-saffron-400' : ''
            }`}
          >
            <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              bgmPlaying
                ? 'border-saffron-400'
                : 'border-cream-100/30 group-hover:border-saffron-400'
            }`}>
              {bgmPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.5 8.5a5 5 0 010 7" strokeLinecap="round" />
                  <path d="M18.5 5.5a9 9 0 010 13" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="22" y1="9" x2="16" y2="15" strokeLinecap="round" />
                  <line x1="16" y1="9" x2="22" y2="15" strokeLinecap="round" />
                </svg>
              )}
            </span>
          </button>
          <button
            onClick={onExit}
            className="group flex items-center gap-2 text-cream-100/80 hover:text-cream-50 text-xs tracking-[0.3em] uppercase transition-colors"
            aria-label="Exit"
          >
            <span className="hidden sm:inline">Exit</span>
            <span className="w-8 h-8 rounded-full border border-cream-100/30 group-hover:border-saffron-400 flex items-center justify-center transition-colors">&#10005;</span>
          </button>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16">
        <div className="max-w-5xl w-full text-center">
          <div ref={authorRef} className="text-saffron-300/80 text-xs md:text-sm tracking-[0.4em] uppercase mb-8">
            &mdash; {current.author}
          </div>

          <div ref={textRef} className="font-serif text-cream-50">
            <ThoughtWords text={current.text} />
          </div>

          {current.textKn && (
            <div className="mt-8 font-kannada text-cream-200/40 text-xl md:text-2xl">
              {current.textKn}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-20 p-6 md:p-10 flex items-end justify-between gap-6">
        <div className="flex items-center gap-2">
          {thoughts.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              aria-label={`Go to thought ${i + 1}`}
              className={`h-1 transition-all rounded-full ${
                i === index ? 'w-8 bg-saffron-400' : 'w-3 bg-cream-100/30 hover:bg-cream-100/60'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={isAdvancing}
            className="w-12 h-12 rounded-full border border-cream-100/30 text-cream-100 hover:bg-cream-100/10 hover:border-saffron-400 transition-all disabled:opacity-30"
            aria-label="Previous thought"
          >&#8592;</button>
          <button
            onClick={goNext}
            disabled={isAdvancing}
            className="w-12 h-12 rounded-full bg-saffron-500 hover:bg-saffron-400 text-white transition-all disabled:opacity-30 shadow-[0_0_30px_rgba(210,105,30,0.4)]"
            aria-label="Next thought"
          >&#8594;</button>
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-cream-100/30">
        Use &larr; &rarr; to navigate &middot; M to toggle BGM &middot; Esc to exit
      </div>
    </div>
  );
}

function ThoughtWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-3 last:mr-0">
          <span className="thought-word inline-block">{w}</span>
        </span>
      ))}
    </h2>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <span
          key={i}
          className="absolute block w-1 h-1 bg-saffron-300 rounded-full opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `thought-float-${i % 4} ${10 + Math.random() * 12}s linear infinite`,
            animationDelay: `${-Math.random() * 10}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes thought-float-0 { from { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.6; } 80% { opacity: 0.4; } to { transform: translate(-80px, -100vh); opacity: 0; } }
        @keyframes thought-float-1 { from { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.5; } 80% { opacity: 0.3; } to { transform: translate(60px, -100vh); opacity: 0; } }
        @keyframes thought-float-2 { from { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.7; } 80% { opacity: 0.4; } to { transform: translate(-40px, -100vh); opacity: 0; } }
        @keyframes thought-float-3 { from { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.6; } 80% { opacity: 0.4; } to { transform: translate(40px, -100vh); opacity: 0; } }
      `}</style>
    </div>
  );
}

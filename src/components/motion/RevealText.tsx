'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  delay?: number;
  stagger?: number;
  trigger?: boolean;
}

/**
 * Splits text into spans-per-word and animates them on scroll.
 * Each word slides up + fades in with a configurable stagger.
 */
export function RevealText({
  children,
  className,
  as = 'div',
  delay = 0,
  stagger = 0.04,
  trigger = true,
}: RevealTextProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const words = ref.current.querySelectorAll<HTMLSpanElement>('.reveal-word');
    if (!words.length) return;

    const tweenConfig = {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger,
      delay,
      ease: 'power3.out',
    };

    if (trigger) {
      gsap.fromTo(
        words,
        { opacity: 0, y: 40 },
        {
          ...tweenConfig,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    } else {
      gsap.fromTo(words, { opacity: 0, y: 40 }, tweenConfig);
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === ref.current) t.kill();
      });
    };
  }, [children, delay, stagger, trigger]);

  const words = children.split(/(\s+)/).map((word, i) => {
    if (/^\s+$/.test(word)) return word;
    return (
      <span key={i} className="reveal-word inline-block">
        {word}
      </span>
    );
  });

  const Component = as as keyof JSX.IntrinsicElements;
  // Use any-cast for the ref since the dynamic tag's element type is narrower than HTMLElement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ComponentAny = Component as any;
  return (
    <ComponentAny ref={ref} className={cn('overflow-hidden', className)}>
      {words}
    </ComponentAny>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // -1 to 1, negative moves up slower than scroll
  imgClassName?: string;
}

/** A wrapper that translates the image on vertical scroll for a parallax effect. */
export function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.3,
  imgClassName,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!ref.current || !imgRef.current) return;
    const tween = gsap.to(imgRef.current, {
      yPercent: -20 * speed * 5,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn('overflow-hidden relative', className)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn('absolute inset-0 w-full h-[120%] object-cover', imgClassName)}
      />
    </div>
  );
}

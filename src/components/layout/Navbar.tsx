'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/store/cartStore';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/thoughts', label: 'Thoughts' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Persisted cart state (localStorage) isn't available on the server, so we
  // mount-flag any UI that depends on it to avoid hydration mismatches.
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const itemCount = useCart((s) => s.itemCount());
  const toggleCart = useCart((s) => s.toggle);

  useEffect(() => {
    setMounted(true);
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-earth-900/80 backdrop-blur-md border-b border-cream-100/10'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/assets/logo.svg" alt="GauBharath" className="w-10 h-10 transition-transform group-hover:rotate-12" />
          <div className="hidden sm:block">
            <div className="font-serif text-cream-50 text-lg leading-none tracking-wide">GauBharath</div>
            <div className="text-saffron-400 text-[10px] tracking-[0.3em] uppercase">ಗೋಭಾರತ್</div>
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  'relative text-sm tracking-wide transition-colors',
                  pathname === l.href ? 'text-saffron-400' : 'text-cream-200 hover:text-cream-50',
                )}
              >
                {l.label}
                {pathname === l.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-saffron-400" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleCart}
            className="relative p-2 text-cream-100 hover:text-saffron-400 transition-colors"
            aria-label="Open cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-12L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-cream-100"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M6 6 L18 18 M6 18 L18 6" strokeLinecap="round" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-cream-100/10 bg-earth-900/95 backdrop-blur-md">
          <ul className="px-6 py-6 space-y-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'block text-lg font-serif',
                    pathname === l.href ? 'text-saffron-400' : 'text-cream-100',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

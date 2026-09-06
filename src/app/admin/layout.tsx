'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/thoughts', label: 'Thoughts' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, loading, signOut } = useAdminAuth();

  useEffect(() => {
    if (loading) return;
    if (pathname === '/admin/login') return;
    if (!user) {
      router.push('/admin/login');
      return;
    }
    if (!isAdmin) {
      router.push('/admin/login?error=unauthorised');
    }
  }, [user, isAdmin, loading, router, pathname]);

  // Login page renders bare
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="pt-32 text-center text-cream-200/60">Loading admin…</div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="md:sticky md:top-24 md:self-start">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors',
                    active
                      ? 'bg-saffron-500/20 text-saffron-300 border border-saffron-500/30'
                      : 'text-cream-200/70 hover:text-cream-50 hover:bg-earth-800/40',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => signOut().then(() => router.push('/admin/login'))}
              className="md:mt-4 px-4 py-2.5 rounded-xl text-sm text-cream-200/70 hover:text-cream-50 hover:bg-earth-800/40 text-left"
            >
              Sign out
            </button>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

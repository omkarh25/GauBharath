'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cartStore';
import { formatINR, cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, close, updateQuantity, remove, subtotal, itemCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-500',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={close}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-earth-900 border-l border-cream-100/10 shadow-2xl transition-transform duration-500 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-100/10">
          <div>
            <h2 className="font-serif text-xl text-cream-50">Your Cart</h2>
            <p className="text-xs text-cream-200/60 mt-1">
              {itemCount()} {itemCount() === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="p-2 text-cream-100 hover:text-saffron-400 transition-colors"
            aria-label="Close cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6 L18 18 M6 18 L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full border border-cream-100/20 flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EAA65C" strokeWidth="1.2">
                  <path d="M6 6h15l-1.5 9h-12L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-cream-200/70 mb-4">Your cart is empty</p>
              <Link href="/shop" onClick={close} className="btn-primary">
                Browse Shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 p-3 rounded-xl bg-earth-800/40 border border-cream-100/10">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-earth-700 flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.titleEn} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-cream-50 text-sm leading-snug truncate">{item.titleEn}</h4>
                    <p className="text-saffron-400 text-xs mt-1">{formatINR(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-cream-100/20 text-cream-100 hover:bg-cream-100/10 flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-cream-50 text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-cream-100/20 text-cream-100 hover:bg-cream-100/10 flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(item.productId)}
                        className="ml-auto text-cream-200/50 hover:text-saffron-400 text-xs"
                        aria-label="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-cream-100/10 px-6 py-5 space-y-3">
            <div className="flex items-center justify-between text-cream-100">
              <span>Subtotal</span>
              <span className="font-serif text-xl text-saffron-400">{formatINR(subtotal())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

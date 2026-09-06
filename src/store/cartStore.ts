'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderItem, Product } from '@/types';
import { logger } from '@/lib/utils';

interface CartState {
  items: OrderItem[];
  isOpen: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                slug: product.slug,
                titleEn: product.titleEn,
                titleKn: product.titleKn,
                price: product.price,
                quantity,
                imageUrl: product.imageUrl,
              },
            ],
            isOpen: true,
          });
        }
        logger.info('Added to cart:', product.titleEn);
      },
      remove: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().remove(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        });
      },
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'gaubharath-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

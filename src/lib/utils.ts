import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes intelligently. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format INR currency. */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Slugify a string for URLs. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Generate a unique ID for new documents. */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Convert various inputs to a number safely. */
export function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Truncate text to N characters. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

/** Get discount percentage. */
export function discountPercent(price: number, original?: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

/** Logger wrapper — uses console so it works in browser & server. */
export const logger = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') console.log('[DEBUG]', ...args);
  },
};

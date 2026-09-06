'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessInner() {
  const params = useSearchParams();
  const orderId = params.get('orderId') ?? '—';

  return (
    <div className="pt-32 pb-12 container-narrow px-6 text-center">
      <div className="text-7xl mb-6">🙏</div>
      <h1 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">Order Confirmed</h1>
      <p className="text-cream-200/70 max-w-xl mx-auto mb-2">
        Thank you for your seva. Your order has been received and is being prepared with care.
      </p>
      <p className="text-saffron-400 font-mono text-sm mb-10">Order ID: {orderId}</p>
      <Link href="/shop" className="btn-primary">Continue Shopping</Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-cream-100">Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}

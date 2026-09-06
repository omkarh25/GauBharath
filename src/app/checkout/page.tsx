'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cartStore';
import { formatINR, logger } from '@/lib/utils';
import type { Order, OrderItem } from '@/types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const SHIPPING_FLAT = 50;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, close } = useCart();
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = subtotal() + (items.length > 0 ? SHIPPING_FLAT : 0);

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, notes: { source: 'gaubharath-checkout' } }),
      });
      if (!orderRes.ok) throw new Error('Could not create order');
      const { orderId, keyId, amount, currency } = await orderRes.json();

      // 2. Load Razorpay widget
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay failed to load. Check your network.');

      // 3. Open checkout
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'GauBharath',
        description: `Order of ${items.length} item${items.length > 1 ? 's' : ''}`,
        order_id: orderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        notes: { address: `${customer.address}, ${customer.city}` },
        theme: { color: '#D2691E' },
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) {
          // 4. Verify & persist
          const orderPayload: Partial<Order> = {
            items: items as OrderItem[],
            subtotal: subtotal(),
            shipping: SHIPPING_FLAT,
            total,
            customer,
            status: 'paid',
          };
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              order: orderPayload,
            }),
          });

          if (!verifyRes.ok) {
            const j = await verifyRes.json().catch(() => ({}));
            throw new Error(j.error ?? 'Verification failed');
          }

          clear();
          close();
          router.push(`/checkout/success?orderId=${response.razorpay_order_id}`);
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const rz = new window.Razorpay(options);
      rz.on('payment.failed', (resp: any) => {
        logger.error('Payment failed', resp.error);
        setError(resp.error?.description ?? 'Payment failed');
        setProcessing(false);
      });
      rz.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setProcessing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-12 container-narrow px-6 text-center">
        <h1 className="font-serif text-3xl text-cream-50 mb-4">Your cart is empty</h1>
        <p className="text-cream-200/60 mb-6">Add a few products before checkout.</p>
        <a href="/shop" className="btn-primary">Browse Shop</a>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-12">
      <div className="container-wide px-6 md:px-12">
        <h1 className="font-serif text-4xl md:text-5xl text-cream-50 mb-10">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Contact">
              <Field label="Full Name" required>
                <input type="text" required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="form-input" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Email" required>
                  <input type="email" required value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className="form-input" />
                </Field>
                <Field label="Phone" required>
                  <input type="tel" required pattern="[0-9+\-\s]{7,}" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className="form-input" />
                </Field>
              </div>
            </Section>

            <Section title="Shipping Address">
              <Field label="Address" required>
                <textarea required rows={3} value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className="form-input" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="City" required>
                  <input type="text" required value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} className="form-input" />
                </Field>
                <Field label="State" required>
                  <input type="text" required value={customer.state} onChange={(e) => setCustomer({ ...customer, state: e.target.value })} className="form-input" />
                </Field>
                <Field label="Pincode" required>
                  <input type="text" required pattern="[0-9]{6}" value={customer.pincode} onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })} className="form-input" />
                </Field>
              </div>
            </Section>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
                {error}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="p-6 rounded-2xl bg-earth-800/40 border border-cream-100/10 sticky top-28">
              <h3 className="font-serif text-xl text-cream-50 mb-4">Order Summary</h3>
              <ul className="space-y-3 mb-4">
                {items.map((i) => (
                  <li key={i.productId} className="flex justify-between text-sm">
                    <span className="text-cream-200 truncate pr-3">
                      {i.titleEn} <span className="text-cream-200/50">× {i.quantity}</span>
                    </span>
                    <span className="text-cream-50 flex-shrink-0">{formatINR(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-cream-100/10 pt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatINR(subtotal())} />
                <Row label="Shipping" value={formatINR(SHIPPING_FLAT)} />
                <Row label="Total" value={formatINR(total)} bold />
              </div>

              <button type="submit" disabled={processing} className="btn-primary w-full mt-6 disabled:opacity-50">
                {processing ? 'Processing…' : `Pay ${formatINR(total)}`}
              </button>
              <p className="text-cream-200/40 text-xs mt-3 text-center">
                Secured by Razorpay · UPI, Cards, NetBanking
              </p>
            </div>
          </aside>
        </form>
      </div>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          background-color: rgba(58, 36, 16, 0.6);
          border: 1px solid rgba(245, 230, 211, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: rgb(245, 230, 211);
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.form-input:focus) { border-color: #D2691E; }
        :global(.form-input::placeholder) { color: rgba(245, 230, 211, 0.4); }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-cream-50 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-cream-200/70 text-xs uppercase tracking-wider mb-2">
        {label} {required && <span className="text-saffron-400">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-cream-50 font-serif text-lg pt-2 border-t border-cream-100/10' : 'text-cream-200'}`}>
      <span>{label}</span>
      <span className={bold ? 'text-saffron-400' : ''}>{value}</span>
    </div>
  );
}

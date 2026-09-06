'use client';

import { useEffect, useState } from 'react';
import { formatINR } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const statuses: OrderStatus[] = ['created', 'paid', 'failed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((j) => setOrders(j.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    // Optimistic
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-cream-50">Orders</h1>
        <p className="text-cream-200/60 text-sm mt-1">{orders.length} total</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl shimmer bg-earth-800/40" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center text-cream-200/60 border border-dashed border-cream-100/10 rounded-2xl">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl bg-earth-800/40 border border-cream-100/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-earth-700/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-cream-50 font-mono text-sm">{o.id.slice(0, 16)}…</div>
                  <div className="text-cream-200/50 text-xs hidden md:block">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={o.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateStatus(o.id, e.target.value as OrderStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-earth-900 border border-cream-100/10 rounded-full px-3 py-1 text-xs text-cream-100"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="text-saffron-400 font-serif text-lg w-24 text-right">{formatINR(o.total)}</div>
                </div>
              </button>
              {expanded === o.id && (
                <div className="px-5 pb-5 border-t border-cream-100/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div>
                      <h4 className="text-cream-200/60 text-xs uppercase tracking-wider mb-2">Customer</h4>
                      <div className="text-cream-50">{o.customer.name}</div>
                      <div className="text-cream-200/70 text-sm">{o.customer.email}</div>
                      <div className="text-cream-200/70 text-sm">{o.customer.phone}</div>
                      <div className="text-cream-200/70 text-sm mt-2">{o.customer.address}</div>
                      <div className="text-cream-200/70 text-sm">{o.customer.city}, {o.customer.state} {o.customer.pincode}</div>
                    </div>
                    <div>
                      <h4 className="text-cream-200/60 text-xs uppercase tracking-wider mb-2">Items</h4>
                      <ul className="space-y-1 text-sm">
                        {o.items.map((i) => (
                          <li key={i.productId} className="flex justify-between text-cream-200/80">
                            <span>{i.titleEn} × {i.quantity}</span>
                            <span className="text-cream-50">{formatINR(i.price * i.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-cream-100/10 mt-2 pt-2 text-sm">
                        <div className="flex justify-between text-cream-200/70"><span>Subtotal</span><span>{formatINR(o.subtotal)}</span></div>
                        <div className="flex justify-between text-cream-200/70"><span>Shipping</span><span>{formatINR(o.shipping)}</span></div>
                        <div className="flex justify-between text-cream-50 font-serif text-lg mt-1"><span>Total</span><span className="text-saffron-400">{formatINR(o.total)}</span></div>
                      </div>
                    </div>
                  </div>
                  {o.razorpayPaymentId && (
                    <div className="text-cream-200/50 text-xs">
                      Payment ID: <span className="font-mono">{o.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

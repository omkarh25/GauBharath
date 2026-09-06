'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { formatINR } from '@/lib/utils';
import type { Order, Product, Thought } from '@/types';

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, COLLECTIONS.products), (s) => {
      setProducts(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) })));
    });
    const unsubT = onSnapshot(collection(db, COLLECTIONS.thoughts), (s) => {
      setThoughts(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Thought, 'id'>) })));
    });

    fetch('/api/orders')
      .then((r) => r.json())
      .then((j) => setOrders(j.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));

    return () => {
      unsubP();
      unsubT();
    };
  }, []);

  const paidOrders = orders.filter((o) => o.status === 'paid');
  const revenue = paidOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-cream-50 mb-1">Dashboard</h1>
        <p className="text-cream-200/60 text-sm">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat label="Products" value={products.length} loading={loading} />
        <Stat label="Thoughts" value={thoughts.length} loading={loading} />
        <Stat label="Orders" value={orders.length} loading={loading} />
        <Stat label="Revenue" value={formatINR(revenue)} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Recent Orders" href="/admin/orders">
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between py-3 border-b border-cream-100/5 last:border-0">
              <div>
                <div className="text-cream-50 text-sm font-mono">{o.id.slice(0, 16)}…</div>
                <div className="text-cream-200/50 text-xs">{o.customer?.name}</div>
              </div>
              <div className="text-right">
                <div className="text-saffron-400">{formatINR(o.total ?? 0)}</div>
                <div className="text-cream-200/50 text-xs">{o.status}</div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <Empty label="No orders yet" />}
        </Panel>

        <Panel title="Quick Actions" href="/admin/products">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Link href="/admin/products/new" className="p-4 rounded-xl bg-saffron-500/10 border border-saffron-500/20 hover:bg-saffron-500/20 text-center">
              <div className="text-saffron-300 text-2xl mb-1">+</div>
              <div className="text-cream-100 text-sm">Add Product</div>
            </Link>
            <Link href="/admin/thoughts" className="p-4 rounded-xl bg-forest-400/10 border border-forest-400/20 hover:bg-forest-400/20 text-center">
              <div className="text-forest-300 text-2xl mb-1">+</div>
              <div className="text-cream-100 text-sm">Add Thought</div>
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Stat({ label, value, loading }: { label: string; value: string | number; loading: boolean }) {
  return (
    <div className="p-5 rounded-2xl bg-earth-800/40 border border-cream-100/10">
      <div className="text-cream-200/60 text-xs uppercase tracking-wider">{label}</div>
      <div className="font-serif text-3xl text-cream-50 mt-2">
        {loading ? '—' : value}
      </div>
    </div>
  );
}

function Panel({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-earth-800/40 border border-cream-100/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg text-cream-50">{title}</h3>
        {href && (
          <Link href={href} className="text-saffron-400 text-xs hover:underline">
            View all →
          </Link>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="py-8 text-center text-cream-200/50 text-sm">{label}</div>;
}

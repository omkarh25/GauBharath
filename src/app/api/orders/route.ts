import { NextRequest, NextResponse } from 'next/server';
import { adminDb, ADMIN_COLLECTIONS } from '@/lib/firebase/admin';
import { logger } from '@/lib/utils';
import type { Order } from '@/types';

export const runtime = 'nodejs';

/**
 * GET  /api/orders        — list all orders (admin)
 * POST /api/orders        — persist a paid order
 * PATCH /api/orders?id=…  — update order status (admin)
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Order>;
    if (!body.razorpayOrderId || !body.items?.length || !body.customer) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    const id = body.id ?? `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const order: Order = {
      id,
      razorpayOrderId: body.razorpayOrderId!,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
      items: body.items!,
      subtotal: body.subtotal ?? 0,
      shipping: body.shipping ?? 0,
      total: body.total ?? 0,
      customer: body.customer!,
      status: body.status ?? 'paid',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb().collection(ADMIN_COLLECTIONS.orders).doc(id).set(order);
    logger.info('Order persisted:', id);

    return NextResponse.json({ success: true, orderId: id, order });
  } catch (err) {
    logger.error('Order persist error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save order' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const snap = await adminDb()
      .collection(ADMIN_COLLECTIONS.orders)
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const orders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }));
    return NextResponse.json({ orders });
  } catch (err) {
    logger.error('Orders list error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to list orders' },
      { status: 500 },
    );
  }
}

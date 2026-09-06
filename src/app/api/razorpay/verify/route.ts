import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { logger } from '@/lib/utils';

export const runtime = 'nodejs';

/**
 * POST /api/razorpay/verify
 * Body: { orderId, paymentId, signature, order?: Order }
 * Verifies the payment and (optionally) persists the order.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature } = body as {
      orderId: string;
      paymentId: string;
      signature: string;
    };

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
    }

    const valid = verifyRazorpaySignature({ orderId, paymentId, signature });
    if (!valid) {
      logger.warn('Razorpay signature mismatch', { orderId, paymentId });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Forward to /api/orders to persist
    const orderPayload = { ...body.order, razorpayOrderId: orderId, razorpayPaymentId: paymentId, razorpaySignature: signature, status: 'paid' };
    const baseUrl = process.env.APP_BASE_URL ?? new URL(req.url).origin;
    const persist = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    if (!persist.ok) {
      const txt = await persist.text();
      logger.error('Order persist failed:', txt);
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (err) {
    logger.error('Verify error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Verification failed' },
      { status: 500 },
    );
  }
}

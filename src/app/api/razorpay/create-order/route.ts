import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { logger } from '@/lib/utils';

export const runtime = 'nodejs';

/**
 * POST /api/razorpay/create-order
 * Body: { amount: number (in INR), receipt?: string, notes?: object }
 * Returns: { orderId, amount, currency, keyId }
 */
export async function POST(req: NextRequest) {
  try {
    const { amount, receipt, notes } = await req.json();

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const order = await createRazorpayOrder({
      amount: Math.round(amount * 100), // Razorpay expects paise
      receipt: receipt ?? `gb_${Date.now()}`,
      notes,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    logger.error('Create order error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Order creation failed' },
      { status: 500 },
    );
  }
}

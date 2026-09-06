/**
 * Server-side Razorpay helper.
 * Used by API routes to create orders and verify payment signatures.
 * The live keys in .env.example are for demo use; swap to your own key when ready.
 */
import Razorpay from 'razorpay';
import crypto from 'crypto';

let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (_razorpay) return _razorpay;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are missing in environment variables.');
  }
  _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return _razorpay;
}

export interface CreateOrderInput {
  amount: number; // in paise
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(input: CreateOrderInput) {
  const razorpay = getRazorpay();
  return razorpay.orders.create({
    amount: input.amount,
    currency: input.currency ?? 'INR',
    receipt: input.receipt,
    notes: input.notes,
  });
}

/** Verify a Razorpay payment signature. */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { orderId, paymentId, signature } = params;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
}

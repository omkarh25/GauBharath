import { NextRequest, NextResponse } from 'next/server';
import { adminDb, ADMIN_COLLECTIONS } from '@/lib/firebase/admin';
import { logger } from '@/lib/utils';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updates: Record<string, unknown> = { ...body, updatedAt: Date.now() };
    await adminDb().collection(ADMIN_COLLECTIONS.orders).doc(id).update(updates);
    logger.info('Order updated:', id, updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('Order update error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Update failed' },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await adminDb().collection(ADMIN_COLLECTIONS.orders).doc(params.id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('Order delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

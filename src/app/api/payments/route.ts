import { requireUser } from '@/lib/server/auth';
import { getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse } from '@/lib/server/utils/response';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await requireUser();

    const collection = await getPaymentCollection();

    const payments = await collection
      .find({ isDeleted: { $ne: true }, userId }) // ignore soft-deleted
      .sort({ createdAt: -1 }) // latest first
      .toArray();

    return NextResponse.json(payments);
  } catch (error) {
    return errorResponse('Failed to fetch payments', error);
  }
}

import { requireUser } from '@/lib/server/auth';
import { getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse } from '@/lib/server/utils/response';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireUser();
    const collection = await getPaymentCollection();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '0');
    const status = searchParams.get('status');
    const startTimestamp = searchParams.get('startTimestamp');
    const endTimestamp = searchParams.get('endTimestamp');

    // Start building dynamic filter
    const filter: Record<string, any> = {
      isDeleted: { $ne: true },
      userId,
    };

    if (status) {
      filter.status = status;
    }
    if (startTimestamp || endTimestamp) {
      filter.createdAt = {};
      if (startTimestamp) filter.createdAt.$gte = parseInt(startTimestamp);
      if (endTimestamp) filter.createdAt.$lt = parseInt(endTimestamp);
    }

    const cursor = collection.find(filter).sort({ createdAt: -1 });

    if (limit > 0) {
      cursor.limit(limit);
    }

    const payments = await cursor.toArray();
    return NextResponse.json(payments);
  } catch (error) {
    return errorResponse('Failed to fetch payments', error);
  }
}

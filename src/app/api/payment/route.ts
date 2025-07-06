import { requireUser } from '@/lib/server/auth';
import { getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse } from '@/lib/server/utils/response';
import { CreatePaymentRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// ----------------- POST -----------------
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireUser();

    const collection = await getPaymentCollection();
    const payload: CreatePaymentRequest = await req.json();

    const timestamp = Date.now();

    const newPayment = {
      ...payload,
      id: uuidv4(),
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
      isDeleted: false,
    };

    const response = await collection.insertOne(newPayment);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return errorResponse('Failed to create payment', error, 400);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { requireUser } from '@/lib/server/auth';
import { createActivityLog, withTransaction } from '@/lib/server/db/db-helper';
import { getPaymentActivityLogCollection, getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse } from '@/lib/server/utils/response';
import { CreatePaymentRequest } from '@/types/api';

// ----------------- POST -----------------
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireUser();
    const payload: CreatePaymentRequest = await req.json();
    const paymentCollection = await getPaymentCollection();
    const paymentActivityCollection = await getPaymentActivityLogCollection();

    const timestamp = Date.now();
    const paymentId = uuidv4();

    const newPayment = {
      ...payload,
      id: paymentId,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
      isDeleted: false,
    };

    const paymentActivity = createActivityLog({
      studentId: payload.studentId,
      userId,
      type: 'payment_created',
      timestamp,
      meta: { ...newPayment },
    });

    const result = await withTransaction(async (session) => {
      const res = await paymentCollection.insertOne(newPayment, { session });
      await paymentActivityCollection.insertOne(paymentActivity, { session });
      return res;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse('Failed to create payment', error, 400);
  }
}

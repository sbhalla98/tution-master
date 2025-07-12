import { requireUser } from '@/lib/server/auth';
import { withTransaction } from '@/lib/server/db/db-helper';
import {
  findPaymentById,
  getPaymentActivityLogCollection,
  getPaymentCollection,
} from '@/lib/server/db/payments';
import { errorResponse, paymentNotFoundResponse } from '@/lib/server/utils/response';
import { getChangedValues } from '@/lib/utils';
import { Payment } from '@/types';
import { UpdatePaymentRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

type ContextType = { params: Promise<{ id: string }> };

// ----------------- GET -----------------
export async function GET(request: NextRequest, context: ContextType) {
  const { id } = await context.params;
  try {
    const { userId } = await requireUser();
    const payment = await findPaymentById(id, userId);

    if (!payment) return paymentNotFoundResponse(id, userId);

    return NextResponse.json(payment);
  } catch (error) {
    return errorResponse(`Error fetching payment ${id}`, error);
  }
}

// ----------------- PUT -----------------
export async function PUT(request: NextRequest, context: ContextType) {
  const { id } = await context.params;

  try {
    const { userId } = await requireUser();
    const collection = await getPaymentCollection();
    const activityCollection = await getPaymentActivityLogCollection();

    const payment = await findPaymentById(id, userId);
    if (!payment) return paymentNotFoundResponse(id, userId);

    const payload: UpdatePaymentRequest = await request.json();
    const timestamp = Date.now();

    const updatedPayment = {
      ...payload,
      updatedAt: timestamp,
    };

    const updatedFields = getChangedValues(payment, payload);

    const activityLogs = Object.entries(updatedFields).map(([key, value]) => ({
      meta: { from: payment[key as keyof Payment], key, to: value },
      paymentId: id,
      studentId: payment.studentId,
      timestamp,
      type: `${key}_updated`,
      userId,
    }));

    const result = await withTransaction(async (session) => {
      const res = await collection.updateOne({ id, userId }, { $set: updatedPayment }, { session });

      if (activityLogs.length > 0) {
        await activityCollection.insertMany(activityLogs, { session });
      }

      return res;
    });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error updating payment ${id}`, error);
  }
}

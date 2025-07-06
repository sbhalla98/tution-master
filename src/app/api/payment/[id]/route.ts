import { requireUser } from '@/lib/server/auth';
import { findPaymentById, getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse, paymentNotFoundResponse } from '@/lib/server/utils/response';
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
    const payment = await findPaymentById(id, userId);

    if (!payment) return paymentNotFoundResponse(id, userId);

    const payload: UpdatePaymentRequest = await request.json();

    const updatedPayment = {
      ...payload,
      updatedAt: Date.now(),
    };

    const result = await collection.updateOne({ id, userId }, { $set: updatedPayment });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error updating payment ${id}`, error);
  }
}

import { requireUser } from '@/lib/server/auth';
import { findPaymentById, getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse, paymentNotFoundResponse } from '@/lib/server/utils/response';
import { UpdatePaymentRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

type ParamsType = {
  params: { id: string };
};

// ----------------- GET -----------------
export async function GET(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const payment = await findPaymentById(params.id, userId);

    if (!payment) return paymentNotFoundResponse(params.id, userId);

    return NextResponse.json(payment);
  } catch (error) {
    return errorResponse(`Error fetching payment ${params.id}`, error);
  }
}

// ----------------- PUT -----------------
export async function PUT(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const collection = await getPaymentCollection();
    const payment = await findPaymentById(params.id, userId);

    if (!payment) return paymentNotFoundResponse(params.id, userId);

    const payload: UpdatePaymentRequest = await request.json();

    const updatedPayment = {
      ...payload,
      updatedAt: Date.now(),
    };

    const result = await collection.updateOne({ id: params.id, userId }, { $set: updatedPayment });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error updating payment ${params.id}`, error);
  }
}

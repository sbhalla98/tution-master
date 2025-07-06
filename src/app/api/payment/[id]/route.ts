import { requireUser } from '@/lib/server/auth';
import { findPaymentById, getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse, paymentNotFoundResponse } from '@/lib/server/utils/response';
import { Payment } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

type ParamsType = {
  params: { id: string };
};

// ----------------- GET -----------------
export async function GET(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const student = await findPaymentById(params.id, userId);

    if (!student) return paymentNotFoundResponse(params.id, userId);

    return NextResponse.json(student);
  } catch (error) {
    return errorResponse(`Error fetching payment ${params.id}`, error);
  }
}

// ----------------- PUT -----------------
export async function PUT(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const collection = await getPaymentCollection();
    const student = await findPaymentById(params.id, userId);

    if (!student) return paymentNotFoundResponse(params.id, userId);

    const body: Partial<Omit<Payment, 'id' | 'userId' | 'createdAt' | 'deletedAt' | 'isDeleted'>> =
      await request.json();

    const updatedPayment: Partial<
      Omit<Payment, 'id' | 'userId' | 'createdAt' | 'deletedAt' | 'isDeleted'>
    > = {
      ...body,
      updatedAt: Date.now(),
    };

    const result = await collection.updateOne({ id: params.id, userId }, { $set: updatedPayment });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error updating payment ${params.id}`, error);
  }
}

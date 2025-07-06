import { requireUser } from '@/lib/server/auth';
import { getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse } from '@/lib/server/utils/response';
import { NextRequest, NextResponse } from 'next/server';

type ParamsType = {
  params: { 'student-id': string };
};

export async function GET(request: NextRequest, { params }: ParamsType) {
  const studentId = params['student-id'];
  try {
    const { userId } = await requireUser();

    const collection = await getPaymentCollection();

    const payments = await collection
      .find({ userId, studentId, isDeleted: { $ne: true } }) // ignore soft-deleted
      .sort({ createdAt: -1 }) // latest first
      .toArray();

    return NextResponse.json(payments);
  } catch (error) {
    return errorResponse(`Failed to fetch payments for student with ID ${studentId}`, error);
  }
}

import { requireUser } from '@/lib/server/auth';
import { getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse } from '@/lib/server/utils/response';
import { NextRequest, NextResponse } from 'next/server';

type ContextType = { params: Promise<{ 'student-id': string }> };

export async function GET(request: NextRequest, context: ContextType) {
  const { 'student-id': studentId } = await context.params;
  try {
    const { userId } = await requireUser();

    const collection = await getPaymentCollection();

    const payments = await collection
      .find({ isDeleted: { $ne: true }, studentId, userId }) // ignore soft-deleted
      .sort({ createdAt: -1 }) // latest first
      .toArray();

    return NextResponse.json(payments);
  } catch (error) {
    return errorResponse(`Failed to fetch payments for student with ID ${studentId}`, error);
  }
}

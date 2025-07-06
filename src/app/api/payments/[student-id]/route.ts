import { mockPayments } from '@/data/mockData';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { 'student-id': string } }) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const payments = mockPayments.filter((s) => s.studentId === params['student-id']);
  if (!payments) {
    return NextResponse.json({ message: 'Payments not found' }, { status: 404 });
  }

  return NextResponse.json(payments);
}

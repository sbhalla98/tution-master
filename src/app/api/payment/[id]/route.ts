import { mockPayments } from '@/data/mockData';
import { Payment } from '@/types/student';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const payment = mockPayments.find((s) => s.id === params.id);
  if (!payment) {
    return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
  }

  return NextResponse.json(payment);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const payment = mockPayments.find((s) => s.id === params.id);
  if (!payment) {
    return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
  }

  try {
    const body: Partial<Omit<Payment, 'id'>> = await request.json();

    const newPayment: Payment = {
      ...payment,
      ...body,
    };

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ err: error, message: 'Invalid JSON' }, { status: 400 });
  }
}

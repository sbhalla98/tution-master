import { Payment } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body: Omit<Payment, 'id'> = await req.json();

    const newPayment: Payment = {
      ...body,
      id: uuidv4(),
    };

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error, message: 'Invalid JSON' }, { status: 400 });
  }
}

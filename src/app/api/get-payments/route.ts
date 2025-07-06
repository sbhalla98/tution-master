import { mockPayments } from '@/data/mockData';
import { NextResponse } from 'next/server';

// GET /api/get-payments
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return NextResponse.json(mockPayments);
}

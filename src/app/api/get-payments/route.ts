import { mockPayments } from '@/data/mockData';

// GET /api/get-payments
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Response.json(mockPayments);
}

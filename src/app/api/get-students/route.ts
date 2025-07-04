import { mockStudents } from '@/data/mockData';

// GET /api/get-students
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Response.json(mockStudents);
}

import { requireUser } from '@/lib/server/auth';
import { getStudentCollection } from '@/lib/server/db/students';
import { errorResponse } from '@/lib/server/utils/response';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireUser();
    const collection = await getStudentCollection();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '0');

    const cursor = collection.find({ isDeleted: { $ne: true }, userId }).sort({ createdAt: -1 });

    if (limit > 0) {
      cursor.limit(limit);
    }

    const students = await cursor.toArray();
    return NextResponse.json(students);
  } catch (error) {
    return errorResponse('Failed to fetch students', error);
  }
}

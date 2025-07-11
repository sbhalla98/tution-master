import { requireUser } from '@/lib/server/auth';
import { getStudentCollection } from '@/lib/server/db/students';
import { errorResponse } from '@/lib/server/utils/response';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await requireUser();

    const collection = await getStudentCollection();

    const students = await collection
      .find({ isDeleted: { $ne: true }, userId }) // ignore soft-deleted
      .sort({ createdAt: -1 }) // latest first
      .toArray();

    return NextResponse.json(students);
  } catch (error) {
    return errorResponse('Failed to fetch students', error);
  }
}

import { requireUser } from '@/lib/server/auth';
import { withTransaction } from '@/lib/server/db/db-helper';
import { getStudentActivityLogCollection, getStudentCollection } from '@/lib/server/db/students';
import { errorResponse } from '@/lib/server/utils/response';
import { CreateStudentRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// ----------------- POST -----------------
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireUser();

    const collection = await getStudentCollection();
    const activityCollection = await getStudentActivityLogCollection();
    const body: CreateStudentRequest = await req.json();

    const timestamp = Date.now();
    const id = uuidv4();

    const student = {
      ...body,
      createdAt: timestamp,
      deletedAt: null,
      id,
      isDeleted: false,
      updatedAt: timestamp,
      userId,
    };

    const log = {
      meta: { ...body },
      studentId: id,
      timestamp,
      type: 'student_created',
      userId,
    };

    const result = await withTransaction(async (session) => {
      await collection.insertOne(student, { session });
      await activityCollection.insertOne(log, { session });
      return student;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse('Failed to create student', error, 400);
  }
}

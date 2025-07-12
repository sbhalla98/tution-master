import { requireUser } from '@/lib/server/auth';
import clientPromise from '@/lib/server/db/client';
import { getStudentActivityLogCollection, getStudentCollection } from '@/lib/server/db/students';
import { errorResponse } from '@/lib/server/utils/response';
import { CreateStudentRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// ----------------- POST -----------------
export async function POST(req: NextRequest) {
  const client = await clientPromise;
  const session = client.startSession();

  try {
    const { userId } = await requireUser();

    const collection = await getStudentCollection();
    const activityCollection = await getStudentActivityLogCollection();
    const body: CreateStudentRequest = await req.json();

    const timestamp = Date.now();
    const newStudentId = uuidv4();

    const newStudent = {
      ...body,
      id: newStudentId,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
      isDeleted: false,
    };

    const activityLog = {
      studentId: newStudentId,
      userId,
      type: 'student_created',
      timestamp,
      meta: {
        ...body,
      },
    };

    let result;

    await session.withTransaction(async () => {
      result = await collection.insertOne(newStudent, { session });
      await activityCollection.insertOne(activityLog, { session });
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse('Failed to create student', error, 400);
  } finally {
    await session.endSession();
  }
}

import { requireUser } from '@/lib/server/auth';
import clientPromise from '@/lib/server/db/client';
import {
  findStudentById,
  getStudentActivityLogCollection,
  getStudentCollection,
} from '@/lib/server/db/students';
import { errorResponse, studentNotFoundResponse } from '@/lib/server/utils/response';
import { UpdateStudentRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

type ContextType = { params: Promise<{ id: string }> };

// ----------------- GET -----------------
export async function GET(request: NextRequest, context: ContextType) {
  const { id } = await context.params;
  try {
    const { userId } = await requireUser();
    const student = await findStudentById(id, userId);

    if (!student) return studentNotFoundResponse(id, userId);

    return NextResponse.json(student);
  } catch (error) {
    return errorResponse(`Error fetching student ${id}`, error);
  }
}

// ----------------- PUT -----------------

export async function PUT(request: NextRequest, context: ContextType) {
  const { id } = await context.params;

  const client = await clientPromise;
  const session = client.startSession();

  try {
    const { userId } = await requireUser();
    const db = client.db();
    const studentsCollection = await getStudentCollection();
    const activityCollection = await getStudentActivityLogCollection();

    const student = await findStudentById(id, userId);
    if (!student) return studentNotFoundResponse(id, userId);

    const payload: UpdateStudentRequest = await request.json();
    const currentTimestamp = Date.now();

    const activityLogs = Object.entries(payload).flatMap(([key, newValue]) => {
      const oldValue = (student as any)[key];
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return [];
      return [
        {
          studentId: id,
          userId,
          type: `${key}_updated`,
          timestamp: currentTimestamp,
          meta: { field: key, from: oldValue, to: newValue },
        },
      ];
    });

    const updatedStudent = {
      ...payload,
      updatedAt: currentTimestamp,
    };

    let result;

    await session.withTransaction(async () => {
      result = await studentsCollection.updateOne(
        { id, userId },
        { $set: updatedStudent },
        { session }
      );

      if (activityLogs.length > 0) {
        await activityCollection.insertMany(activityLogs, { session });
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error updating student ${id}`, error);
  } finally {
    await session.endSession();
  }
}

// ----------------- DELETE -----------------
export async function DELETE(request: NextRequest, context: ContextType) {
  const { id } = await context.params;
  try {
    const { userId } = await requireUser();
    const collection = await getStudentCollection();
    const student = await findStudentById(id, userId);

    if (!student) return studentNotFoundResponse(id, userId);

    const updatedStudent = {
      deletedAt: Date.now(),
      isDeleted: true,
      updatedAt: Date.now(),
    };

    const result = await collection.updateOne({ id, userId }, { $set: updatedStudent });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error deleting student ${id}`, error);
  }
}

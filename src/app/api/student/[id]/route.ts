import { requireUser } from '@/lib/server/auth';
import { withTransaction } from '@/lib/server/db/db-helper';
import {
  findStudentById,
  getStudentActivityLogCollection,
  getStudentCollection,
} from '@/lib/server/db/students';
import { errorResponse, studentNotFoundResponse } from '@/lib/server/utils/response';
import { getChangedValues } from '@/lib/utils';
import { Student } from '@/types';
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

  try {
    const { userId } = await requireUser();
    const studentsCollection = await getStudentCollection();
    const activityCollection = await getStudentActivityLogCollection();

    const student = await findStudentById(id, userId);
    if (!student) return studentNotFoundResponse(id, userId);

    const payload: UpdateStudentRequest = await request.json();
    const currentTimestamp = Date.now();

    const updatedStudent = {
      ...payload,
      updatedAt: currentTimestamp,
    };

    const updatedFields = getChangedValues(student, payload);

    const activityLogs = Object.entries(updatedFields).map(([key, value]) => ({
      studentId: id,
      userId,
      type: `${key}_updated`,
      timestamp: currentTimestamp,
      meta: { key, from: student[key as keyof Student], to: value },
    }));

    const result = await withTransaction(async (session) => {
      const res = await studentsCollection.updateOne(
        { id, userId },
        { $set: updatedStudent },
        { session }
      );

      if (activityLogs.length > 0) {
        await activityCollection.insertMany(activityLogs, { session });
      }

      return res;
    });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error updating student ${id}`, error);
  }
}

// ----------------- DELETE -----------------
export async function DELETE(request: NextRequest, context: ContextType) {
  const { id } = await context.params;

  try {
    const { userId } = await requireUser();
    const collection = await getStudentCollection();
    const activityCollection = await getStudentActivityLogCollection();

    const student = await findStudentById(id, userId);
    if (!student) return studentNotFoundResponse(id, userId);

    const currentTimestamp = Date.now();
    const updatedStudent = {
      deletedAt: currentTimestamp,
      isDeleted: true,
      updatedAt: currentTimestamp,
    };

    const activityLog = {
      studentId: id,
      userId,
      type: 'student_deleted',
      timestamp: currentTimestamp,
      meta: {
        field: 'deleted',
        from: false,
        to: true,
      },
    };

    const result = await withTransaction(async (session) => {
      const res = await collection.updateOne({ id, userId }, { $set: updatedStudent }, { session });
      await activityCollection.insertOne(activityLog, { session });
      return res;
    });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error deleting student ${id}`, error);
  }
}

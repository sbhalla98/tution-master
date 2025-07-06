import { requireUser } from '@/lib/server/auth';
import { findStudentById, getStudentCollection } from '@/lib/server/db/students';
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
  try {
    const { userId } = await requireUser();
    const collection = await getStudentCollection();
    const student = await findStudentById(id, userId);

    if (!student) return studentNotFoundResponse(id, userId);

    const payload: UpdateStudentRequest = await request.json();

    const updatedStudent = {
      ...payload,
      updatedAt: Date.now(),
    };

    const result = await collection.updateOne({ id, userId }, { $set: updatedStudent });

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
    const student = await findStudentById(id, userId);

    if (!student) return studentNotFoundResponse(id, userId);

    const updatedStudent = {
      isDeleted: true,
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await collection.updateOne({ id, userId }, { $set: updatedStudent });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error deleting student ${id}`, error);
  }
}

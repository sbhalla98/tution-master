import { requireUser } from '@/lib/server/auth';
import { findStudentById, getStudentCollection } from '@/lib/server/db/students';
import { errorResponse, studentNotFoundResponse } from '@/lib/server/utils/response';
import { Student } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

type ParamsType = {
  params: { id: string };
};

// ----------------- GET -----------------
export async function GET(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const student = await findStudentById(params.id, userId);

    if (!student) return studentNotFoundResponse(params.id, userId);

    return NextResponse.json(student);
  } catch (error) {
    return errorResponse(`Error fetching student ${params.id}`, error);
  }
}

// ----------------- PUT -----------------
export async function PUT(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const collection = await getStudentCollection();
    const student = await findStudentById(params.id, userId);

    if (!student) return studentNotFoundResponse(params.id, userId);

    const body: Partial<Omit<Student, 'id'>> = await request.json();

    const updatedStudent: Partial<Omit<Student, 'id'>> = {
      ...body,
      updatedAt: Date.now(),
    };

    const result = await collection.updateOne({ id: params.id, userId }, { $set: updatedStudent });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error updating student ${params.id}`, error);
  }
}

// ----------------- DELETE -----------------
export async function DELETE(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const collection = await getStudentCollection();
    const student = await findStudentById(params.id, userId);

    if (!student) return studentNotFoundResponse(params.id, userId);

    const updatedStudent: Partial<Omit<Student, 'id'>> = {
      isDeleted: true,
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await collection.updateOne({ id: params.id, userId }, { $set: updatedStudent });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(`Error deleting student ${params.id}`, error);
  }
}

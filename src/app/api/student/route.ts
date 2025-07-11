import { requireUser } from '@/lib/server/auth';
import { getStudentCollection } from '@/lib/server/db/students';
import { errorResponse } from '@/lib/server/utils/response';
import { CreateStudentRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// ----------------- POST -----------------
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireUser();

    const collection = await getStudentCollection();
    const body: CreateStudentRequest = await req.json();

    const timestamp = Date.now();

    const newStudent = {
      ...body,
      createdAt: timestamp,
      deletedAt: null,
      id: uuidv4(),
      isDeleted: false,
      updatedAt: timestamp,
      userId,
    };

    const response = await collection.insertOne(newStudent);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return errorResponse('Failed to create student', error, 400);
  }
}

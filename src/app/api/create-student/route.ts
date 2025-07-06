import { Student } from '@/types/student';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// POST /api/create-student
// This endpoint creates a new student and returns the created student object with a unique ID.
export async function POST(req: NextRequest) {
  try {
    const body: Omit<Student, 'id'> = await req.json();

    const newStudent: Student = {
      ...body,
      id: uuidv4(),
    };

    return NextResponse.json(newStudent, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

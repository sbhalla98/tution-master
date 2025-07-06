import { Student } from '@/types/student';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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

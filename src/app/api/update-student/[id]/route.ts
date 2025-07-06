import { mockStudents } from '@/data/mockData';
import { Student } from '@/types/student';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/update-student/[id]
// This endpoint updates an existing student and returns the updated student object.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const student = mockStudents.find((s) => s.id === params.id);
  if (!student) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }

  try {
    const body: Omit<Student, 'id'> = await request.json();

    const newStudent: Student = {
      ...student,
      ...body,
    };

    return NextResponse.json(newStudent, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

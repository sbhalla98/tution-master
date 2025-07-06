import { mockStudents } from '@/data/mockData';
import { Student } from '@/types/student';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const student = mockStudents.find((s) => s.id === params.id);
  if (!student) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }

  return NextResponse.json(student);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const student = mockStudents.find((s) => s.id === params.id);
  if (!student) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }

  try {
    const body: Partial<Omit<Student, 'id'>> = await request.json();

    const newStudent: Student = {
      ...student,
      ...body,
    };

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error, message: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const student = mockStudents.find((s) => s.id === params.id);
  if (!student) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }

  return NextResponse.json(student);
}

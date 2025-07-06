import { mockStudents } from '@/data/mockData';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/delete-student/[id]

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const student = mockStudents.find((s) => s.id === params.id);
  if (!student) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }

  return NextResponse.json(student);
}

import clientPromise from '@/lib/mongodb';
import { requireUser } from '@/lib/server/auth';
import { DB_NAME, STUDENT_COLLECTION } from '@/lib/server/constants';
import { Student } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

type ParamsType = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(STUDENT_COLLECTION);

    const student = await collection.findOne({ id: params.id, userId });

    if (!student) {
      const message = `Student with ID ${params.id} not found for user ${userId}`;
      return NextResponse.json({ message, error: message }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    const message = `Error fetching student with ID ${params.id}`;
    return NextResponse.json({ message, error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(STUDENT_COLLECTION);

    const student: Student | null = (await collection.findOne({
      id: params.id,
      userId,
    })) as Student | null;

    if (!student) {
      const message = `Student with ID ${params.id} not found for user ${userId}`;
      return NextResponse.json({ message, error: message }, { status: 404 });
    }
    const body: Partial<Omit<Student, 'id'>> = await request.json();

    const updatedStudent: Partial<Omit<Student, 'id'>> = {
      ...body,
      updatedAt: new Date().getTime(),
    };

    const response = await collection.updateOne(
      { id: params.id, userId },
      { $set: updatedStudent }
    );

    if (response.matchedCount === 0) {
      const message = `Student with ID ${params.id} not found for user ${userId}`;
      return NextResponse.json({ message, error: message }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = `Error updating student with ID ${params.id}`;
    return NextResponse.json({ message, error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: ParamsType) {
  try {
    const { userId } = await requireUser();
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(STUDENT_COLLECTION);

    const student: Student | null = (await collection.findOne({
      id: params.id,
      userId,
    })) as Student | null;

    if (!student) {
      const message = `Student with ID ${params.id} not found for user ${userId}`;
      return NextResponse.json({ message, error: message }, { status: 404 });
    }

    const updatedStudent: Student = {
      ...student,
      updatedAt: new Date().getTime(),
      isDeleted: true,
      deletedAt: new Date().getTime(),
    };

    const response = await collection.updateOne(
      { id: params.id, userId },
      { $set: updatedStudent }
    );

    if (response.matchedCount === 0) {
      const message = `Student with ID ${params.id} not found for user ${userId}`;
      return NextResponse.json({ message, error: message }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = `Error deleting student with ID ${params.id}`;
    return NextResponse.json({ message, error }, { status: 500 });
  }
}

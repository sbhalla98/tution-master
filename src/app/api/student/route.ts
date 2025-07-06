import clientPromise from '@/lib/mongodb';
import { requireUser } from '@/lib/server/auth';
import { DB_NAME, STUDENT_COLLECTION } from '@/lib/server/constants';
import { Student } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireUser();
    const body: Omit<Student, 'id'> = await req.json();
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(STUDENT_COLLECTION);

    const newStudent: Student = {
      ...body,
      id: uuidv4(),
      userId,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      deletedAt: null,
      isDeleted: false,
    };

    const response = await collection.insertOne(newStudent);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, message: 'Invalid JSON' }, { status: 400 });
  }
}

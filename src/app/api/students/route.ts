import clientPromise from '@/lib/mongodb';
import { requireUser } from '@/lib/server/auth';
import { DB_NAME, STUDENT_COLLECTION } from '@/lib/server/constants';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await requireUser();
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(STUDENT_COLLECTION);

    const students = await collection.find({ userId }).toArray();

    return NextResponse.json(students);
  } catch (error) {
    const message = `Error fetching students`;
    return NextResponse.json({ message, error }, { status: 500 });
  }
}

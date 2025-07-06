import { Student } from '@/types';
import { DB_NAME, STUDENT_COLLECTION } from '../constants';
import clientPromise from './client';

export async function getStudentCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(STUDENT_COLLECTION);
}

export async function findStudentById(id: string, userId: string) {
  const collection = await getStudentCollection();
  return (await collection.findOne({ id, userId })) as Student | null;
}

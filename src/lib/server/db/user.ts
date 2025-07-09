import { User } from '@/types';
import { DB_NAME, USER_COLLECTION } from '../constants';
import clientPromise from './client';

export async function getUserCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(USER_COLLECTION);
}

export async function findUserById(id: string) {
  const collection = await getUserCollection();
  return (await collection.findOne({ id })) as User | null;
}

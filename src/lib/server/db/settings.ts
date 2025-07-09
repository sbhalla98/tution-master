import { SETTINGS } from '@/types';
import { DB_NAME, SETTINGS_COLLECTION } from '../constants';
import clientPromise from './client';

export async function getSettingsCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(SETTINGS_COLLECTION);
}

export async function findSettings(userId: string) {
  const collection = await getSettingsCollection();
  return (await collection.findOne({ userId })) as SETTINGS | null;
}

import { Payment } from '@/types';
import { DB_NAME, PAYMENT_ACTIVITY_LOG_COLLECTION, PAYMENT_COLLECTION } from '../constants';
import clientPromise from './client';

export async function getPaymentCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(PAYMENT_COLLECTION);
}

export async function findPaymentById(id: string, userId: string) {
  const collection = await getPaymentCollection();
  return (await collection.findOne({ id, userId })) as Payment | null;
}

export async function getPaymentActivityLogCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(PAYMENT_ACTIVITY_LOG_COLLECTION);
}

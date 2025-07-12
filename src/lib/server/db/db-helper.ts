import clientPromise from './client';

export async function withTransaction<T>(fn: (session: any) => Promise<T>): Promise<T> {
  const client = await clientPromise;
  const session = client.startSession();

  try {
    return await session.withTransaction(async () => {
      return await fn(session);
    });
  } finally {
    await session.endSession();
  }
}

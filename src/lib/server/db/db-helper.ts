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

export function createActivityLog({
  studentId,
  userId,
  type,
  meta,
  timestamp = Date.now(),
}: {
  studentId: string;
  userId: string;
  type: string;
  meta: Record<string, any>;
  timestamp?: number;
}) {
  return {
    studentId,
    userId,
    type,
    timestamp,
    meta,
  };
}

export function createFieldUpdateLogs(
  original: Record<string, any>,
  updated: Record<string, any>,
  studentId: string,
  userId: string,
  timestamp: number
) {
  return Object.entries(updated).flatMap(([key, newValue]) => {
    const oldValue = original[key];
    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return [];
    return [
      createActivityLog({
        studentId,
        userId,
        type: `${key}_updated`,
        meta: { field: key, from: oldValue, to: newValue },
        timestamp,
      }),
    ];
  });
}

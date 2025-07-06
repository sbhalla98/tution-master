// lib/auth.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function requireUser() {
  const { userId } = await auth();

  if (!userId) throw new NextResponse('Unauthorized', { status: 401 });

  return { userId };
}

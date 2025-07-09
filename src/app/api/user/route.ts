import { requireUser } from '@/lib/server/auth';
import { findUserById } from '@/lib/server/db/user';
import { errorResponse, userNotFoundResponse } from '@/lib/server/utils/response';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await requireUser();
    const user = await findUserById(userId);

    if (!user) return userNotFoundResponse(userId);

    return NextResponse.json(user);
  } catch (error) {
    return errorResponse('Error fetching user', error);
  }
}

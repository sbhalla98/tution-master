import { requireUser } from '@/lib/server/auth';
import { findUserById, getUserCollection } from '@/lib/server/db/user';
import { errorResponse, userNotFoundResponse } from '@/lib/server/utils/response';
import { CreateUserRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await requireUser();
    const user = await findUserById(userId);

    if (!user) return userNotFoundResponse(userId);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return errorResponse('Error fetching user', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireUser();
    const collection = await getUserCollection();

    const payload: CreateUserRequest = await req.json();

    const timestamp = Date.now();

    const newUser = {
      ...payload,
      id: userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
      isDeleted: false,
    };

    const response = await collection.insertOne(newUser);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return errorResponse('Error creating user', error);
  }
}

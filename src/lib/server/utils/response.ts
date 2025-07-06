import { NextResponse } from 'next/server';

export function studentNotFoundResponse(id: string, userId: string) {
  const message = `Student with ID ${id} not found for user ${userId}`;
  return NextResponse.json({ message, error: message }, { status: 404 });
}

export function errorResponse(message: string, error: unknown, status = 500) {
  console.error(message, error);
  return NextResponse.json({ message, error }, { status });
}

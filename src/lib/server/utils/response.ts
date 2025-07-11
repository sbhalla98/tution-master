import { NextResponse } from 'next/server';

export function studentNotFoundResponse(id: string, userId: string) {
  const message = `Student with ID ${id} not found for user ${userId}`;
  return NextResponse.json({ error: message, message }, { status: 404 });
}

export function paymentNotFoundResponse(id: string, userId: string) {
  const message = `Payment with ID ${id} not found for user ${userId}`;
  return NextResponse.json({ error: message, message }, { status: 404 });
}

export function userNotFoundResponse(id: string) {
  const message = `User with ID ${id} not found`;
  return NextResponse.json({ error: message, message }, { status: 404 });
}

export function settingsNotFoundResponse(id: string) {
  const message = `Settings for user with ID ${id} not found`;
  return NextResponse.json({ error: message, message }, { status: 404 });
}

export function errorResponse(message: string, error: unknown, status = 500) {
  console.error(message, error);
  return NextResponse.json({ error, message }, { status });
}

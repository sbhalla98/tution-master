import { requireUser } from '@/lib/server/auth';
import { findSettings, getSettingsCollection } from '@/lib/server/db/settings';
import { errorResponse, settingsNotFoundResponse } from '@/lib/server/utils/response';
import { UpdateSettingsRequest } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSettings } from './helper';

export async function GET() {
  try {
    const { userId } = await requireUser();
    const settings = await getOrCreateSettings(userId);

    if (!settings) return settingsNotFoundResponse(userId);

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return errorResponse('Error fetching settings', error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await requireUser();
    const collection = await getSettingsCollection();
    const settings = await findSettings(userId);

    const payload: UpdateSettingsRequest = await req.json();

    if (settings) {
      const updatedSettings = {
        ...payload,
        updatedAt: Date.now(),
      };

      const response = await collection.updateOne({ userId }, { $set: updatedSettings });
      return NextResponse.json(response, { status: 200 });
    } else {
      const newSettings = {
        ...payload,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId,
      };
      const response = await collection.insertOne(newSettings);
      return NextResponse.json(response, { status: 201 });
    }
  } catch (error) {
    return errorResponse('Error updating settings', error);
  }
}

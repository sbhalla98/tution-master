import { getSettingsCollection } from '@/lib/server/db/settings';
import { UpdateSettingsRequest } from '@/types/api';

export async function getOrCreateSettings(userId: string, defaults: UpdateSettingsRequest = {}) {
  const collection = await getSettingsCollection();

  const settings = await collection.findOne({ userId });

  if (settings) return settings;

  const newSettings = {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId,
    ...defaults,
  };

  await collection.insertOne(newSettings);

  return newSettings;
}

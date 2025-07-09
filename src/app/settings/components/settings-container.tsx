'use client';

import { SETTINGS } from '@/types';

type SettingsContainerProps = {
  settings?: SETTINGS | null;
};

export default function SettingsContainer({ settings }: SettingsContainerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-gray-600">Settings functionality is not yet implemented.</p>
      <p className="text-gray-600">Please check back later!</p>
    </div>
  );
}

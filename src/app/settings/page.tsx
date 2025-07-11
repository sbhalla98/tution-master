'use client';

import { getSettings } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import SettingsContainer from './components/settings-container';

export default function Settings() {
  const { data, error, isLoading } = useQuery({
    queryFn: getSettings,
    queryKey: ['settings'],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading settings</div>;
  }

  return <SettingsContainer settings={data} onSave={() => {}} />;
}

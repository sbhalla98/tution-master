'use client';

import { getPayments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import DashboardContainer from './components/dashboard-container';

export default function Dashboard() {
  const {
    data: paymentsData,
    error: paymentsError,
    isLoading: paymentsLoading,
  } = useQuery({
    queryFn: () => getPayments(),
    queryKey: ['payments'],
  });

  if (paymentsLoading) {
    return <div>Loading...</div>;
  }

  if (paymentsError) {
    return <div>Error loading payments: {paymentsError.message}</div>;
  }

  return <DashboardContainer payments={paymentsData} />;
}

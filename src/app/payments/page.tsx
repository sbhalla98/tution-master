'use client';

import { getPayments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import PaymentsContainer from './components/payments-container';

export default function Payments() {
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

  return <PaymentsContainer payments={paymentsData} />;
}

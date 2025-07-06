'use client';

import { getPayments, getStudents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import PaymentsContainer from './components/payments-container';

export default function Payments() {
  const {
    data: studentsData,
    error: studentsError,
    isLoading: studentsLoading,
  } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const {
    data: paymentsData,
    error: paymentsError,
    isLoading: paymentsLoading,
  } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
  });

  if (studentsLoading || paymentsLoading) {
    return <div>Loading...</div>;
  }

  if (studentsError) {
    return <div>Error loading students: {studentsError.message}</div>;
  }

  if (paymentsError) {
    return <div>Error loading payments: {paymentsError.message}</div>;
  }

  return <PaymentsContainer students={studentsData} payments={paymentsData} />;
}

'use client';

import { ErrorState } from '@/components/illustration/error-state';
import StudentsContainerSkeleton from '@/components/skeleton/students-container-skeleton';
import { getPayments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import PaymentsContainer from './components/payments-container';

export default function Payments() {
  const { data, error, isFetching, refetch } = useQuery({
    queryFn: () => getPayments(),
    queryKey: ['payments'],
  });

  if (isFetching) {
    // [TODO] Add the payment skeleton
    return <StudentsContainerSkeleton />;
  }

  if (error) {
    return <ErrorState className="h-full" onReload={refetch} />;
  }

  return <PaymentsContainer payments={data} />;
}

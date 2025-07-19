import StatCard, { CHANGE_TYPE } from '@/components/cards/stat-card';
import { ErrorState } from '@/components/illustration/error-state';
import StatCardSkeleton from '@/components/skeleton/stat-card-skeleton';
import { PAYMENT_STATUS } from '@/constants';
import { getPayments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';

export default function PendingPaymentsWidgetContainer() {
  const { data, error, isFetching, refetch } = useQuery({
    queryFn: () =>
      getPayments({
        status: PAYMENT_STATUS.PENDING,
        startTimestamp: new Date().setDate(1), // Start of current month
        endTimestamp: new Date().setDate(new Date().getDate() + 1), // End of current month
      }),
    queryKey: ['payments', PAYMENT_STATUS.PENDING, 'current_month'],
  });

  if (isFetching) {
    return <StatCardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState title="" description="Failed to fetch pending payments" onReload={refetch} />
    );
  }

  return (
    <StatCard
      title="Pending Payments"
      value={data?.length ?? 0}
      icon={TrendingUp}
      change={'Due this month'}
      changeType={CHANGE_TYPE.NEUTRAL}
    />
  );
}

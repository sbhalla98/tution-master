import StatCard, { CHANGE_TYPE } from '@/components/cards/stat-card';
import { PAYMENT_STATUS } from '@/constants';
import { getPayments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

export default function OverduePaymentsWidgetContainer() {
  const { data, error, isLoading } = useQuery({
    queryFn: () =>
      getPayments({
        status: PAYMENT_STATUS.OVERDUE,
        startTimestamp: new Date().setDate(1), // Start of current month
        endTimestamp: new Date().setDate(new Date().getDate() + 1), // End of current month
      }),
    queryKey: ['payments', PAYMENT_STATUS.OVERDUE, 'current_month'],
  });

  if (isLoading) {
    // [TODO] add skeleton
    return <div>Loading ...</div>;
  }

  if (error) {
    // [TODO] add error handler
    return <div>error ...</div>;
  }

  return (
    <StatCard
      title="Overdue Payments"
      value={data?.length ?? 0}
      icon={AlertCircle}
      change="Needs attention"
      changeType={CHANGE_TYPE.NEGATIVE}
    />
  );
}

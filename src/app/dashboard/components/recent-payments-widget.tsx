'use client';

import RecentPaymentCard from '@/components/cards/recent-payment-card';
import { EmptyState } from '@/components/illustration/empty-state';
import { ErrorState } from '@/components/illustration/error-state';
import RecentPaymentsSkeleton from '@/components/skeleton/recent-payment-widget-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPayments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

const RECENT_PAYMENTS_LIMIT = 5;

export default function RecentPaymentsWidget() {
  const t = useTranslations('recentPayementsWidget');

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: () => getPayments(RECENT_PAYMENTS_LIMIT),
    queryKey: ['payments', RECENT_PAYMENTS_LIMIT],
  });

  const title = t('title');

  if (isLoading) {
    return <RecentPaymentsSkeleton title={title} limit={RECENT_PAYMENTS_LIMIT} />;
  }

  if (error) {
    return (
      <ErrorState
        className="h-full"
        title={t('error.title')}
        description={t('error.description')}
        onReload={refetch}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data && data?.length > 0 ? (
          data.map((payment) => <RecentPaymentCard key={payment.id} payment={payment} />)
        ) : (
          <EmptyState
            className="h-full"
            title={t('empty.title')}
            description={t('empty.description')}
          />
        )}
      </CardContent>
    </Card>
  );
}

'use client';
import StatCard, { CHANGE_TYPE } from '@/components/cards/stat-card';
import Header from '@/components/header';
import { PAYMENT_STATUS } from '@/constants';
import { Payment } from '@/types';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ActiveStudentsWidgetContainer from './active-students-widget-container';
import PendingPaymentsWidgetContainer from './pending-payments-widget-container';
import QuickActionsWidget from './quick-actions-widget';
import RecentPaymentsContainer from './recent-payments-container';
import RecentStudentsContainer from './recent-students-container';
import TotalRevenueWidgetContainer from './total-revenue-widget-container';

type DashboardContainerProps = {
  payments?: Payment[] | null;
};

export default function DashboardContainer({ payments }: DashboardContainerProps) {
  const t = useTranslations('dashboard');

  const overduePayments = (payments ?? []).filter(
    (p) => p.status === PAYMENT_STATUS.OVERDUE
  ).length;

  return (
    <div className="space-y-8">
      <Header title={t('title')} description={t('subtitle')} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActiveStudentsWidgetContainer />
        <TotalRevenueWidgetContainer />
        <PendingPaymentsWidgetContainer />
        {/* [TODO] Need to fix the metrics in this stat card */}

        <StatCard
          title="Overdue Payments"
          value={overduePayments}
          icon={AlertCircle}
          change="Needs attention"
          changeType={CHANGE_TYPE.NEGATIVE}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPaymentsContainer />
        <RecentStudentsContainer />
        <QuickActionsWidget />
      </div>
    </div>
  );
}

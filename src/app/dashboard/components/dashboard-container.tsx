'use client';
import Header from '@/components/header';
import { useTranslations } from 'next-intl';
import ActiveStudentsWidgetContainer from './active-students-widget-container';
import OverduePaymentsWidgetContainer from './overdue-payments-widget-container';
import PendingPaymentsWidgetContainer from './pending-payments-widget-container';
import QuickActionsWidget from './quick-actions-widget';
import RecentPaymentsContainer from './recent-payments-container';
import RecentStudentsContainer from './recent-students-container';
import TotalRevenueWidgetContainer from './total-revenue-widget-container';

export default function DashboardContainer() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-8">
      <Header title={t('title')} description={t('subtitle')} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActiveStudentsWidgetContainer />
        <TotalRevenueWidgetContainer />
        <PendingPaymentsWidgetContainer />
        <OverduePaymentsWidgetContainer />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPaymentsContainer />
        <RecentStudentsContainer />
        <QuickActionsWidget />
      </div>
    </div>
  );
}

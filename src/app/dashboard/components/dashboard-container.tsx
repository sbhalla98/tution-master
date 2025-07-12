'use client';
import StatCard from '@/components/cards/stat-card';
import Header from '@/components/header';
import { PAYMENT_STATUS, STUDENT_STATUS } from '@/constants';
import { Payment, Student } from '@/types';
import { AlertCircle, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import QuickActionsWidget from './quick-actions-widget';
import RecentPaymentsWidget from './recent-payments-widget';
import RecentStudentsWidget from './recent-students-widget';

type DashboardContainerProps = {
  students?: Student[] | null;
  payments?: Payment[] | null;
};

export default function DashboardContainer({ students, payments }: DashboardContainerProps) {
  const t = useTranslations('dashboard');

  const activeStudents = (students ?? []).filter((s) => s.status === STUDENT_STATUS.ACTIVE).length;
  const totalRevenue = (payments ?? [])
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = (payments ?? []).filter(
    (p) => p.status === PAYMENT_STATUS.PENDING
  ).length;
  const overduePayments = (payments ?? []).filter(
    (p) => p.status === PAYMENT_STATUS.OVERDUE
  ).length;

  return (
    <div className="space-y-8">
      <Header title={t('title')} description={t('subtitle')} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* [TODO] Need to fix the metrics in this stat card */}
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon={Users}
          change="+2 this month"
          changeType="positive"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          change="+12% from last month"
          changeType="positive"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          icon={TrendingUp}
          change="Due this month"
          changeType="neutral"
        />
        <StatCard
          title="Overdue Payments"
          value={overduePayments}
          icon={AlertCircle}
          change="Needs attention"
          changeType="negative"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPaymentsWidget />
        <RecentStudentsWidget />
        <QuickActionsWidget />
      </div>
    </div>
  );
}

'use client';
import StatCard from '@/components/cards/stat-card';
import AddStudentForm from '@/components/forms/add-student-form';
import RecordPaymentForm from '@/components/forms/record-payment-form';
import SendRemindersForm from '@/components/forms/send-reminder-form';
import Header from '@/components/header';
import { PAYMENT_STATUS, STUDENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { createPayment, createStudent } from '@/lib/api';
import { Payment, Student } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import QuickActionsWidget from './quick-actions-widget';
import RecentPaymentsWidget from './recent-payments-widget';

type DashboardContainerProps = {
  students?: Student[] | null;
  payments?: Payment[] | null;
};

export default function DashboardContainer({ students, payments }: DashboardContainerProps) {
  const t = useTranslations('dashboard');
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createStudentMutation } = useMutation({
    mutationFn: createStudent,
    onError: () => {
      toast({
        description: 'Failed to add student. Please try again.',
        title: 'Error',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        description: 'Student added successfully',
        title: 'Added new student',
      });
    },
  });

  const { mutate: createPaymentMutation } = useMutation({
    mutationFn: createPayment,
    onError: () => {
      toast({
        description: 'Failed to record payment. Please try again.',
        title: 'Error',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: 'Payment recorded successfully',
        title: 'Payment Recorded',
      });
    },
  });

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

  const recentPayments = (payments ?? [])
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
    .slice(0, 5);

  const overduePaymentsList = (payments ?? []).filter((p) => p.status === PAYMENT_STATUS.OVERDUE);

  const studentsForPayment = (students ?? []).map((student) => ({
    id: student.id,
    monthlyFee: student.monthlyFee,
    name: student.name,
  }));

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
        <RecentPaymentsWidget recentPayments={recentPayments} />
        <QuickActionsWidget
          onAddStudent={setIsAddStudentOpen}
          onRecordPayment={setIsRecordPaymentOpen}
          onSendReminders={setIsRemindersOpen}
        />
      </div>

      <SendRemindersForm
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        payments={overduePaymentsList}
        allowSelection={true}
      />

      <AddStudentForm
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={createStudentMutation}
      />

      <RecordPaymentForm
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onRecordPayment={createPaymentMutation}
        students={studentsForPayment}
      />
    </div>
  );
}

'use client';

import PaymentCard from '@/components/cards/payment-card';
import RecordPaymentForm from '@/components/forms/record-payment-form';
import { EmptyState } from '@/components/illustration/empty-state';
import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { createPayment, markPaymentStatus } from '@/lib/api';
import { Payment, Student } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { PAYMENT_STATUS_FILTER } from '../constants';
import { PaymentStatusFilterType } from '../types';
import PaymentsHeader from './payments-header';
import PaymentSearchFilter from './payments-search-filter';
import SummaryCard, { VARIANTS } from './summary-card';

type PaymentsContainerProps = {
  payments?: Payment[] | null;
  students?: Student[] | null;
};
export default function PaymentsContainer({ payments, students }: PaymentsContainerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilterType>(
    PAYMENT_STATUS_FILTER.ALL
  );
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations('payments');

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
      setIsRecordPaymentOpen(false);
      toast({
        description: 'Payment recorded successfully',
        title: 'Payment Recorded',
      });
    },
  });

  const { mutate: markPaymentStatusMutation } = useMutation({
    mutationFn: markPaymentStatus,
    onError: () => {
      toast({
        description: 'Failed to mark payment as paid. Please try again.',
        title: 'Error',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: 'Payment marked as paid successfully',
        title: 'Payment Updated',
      });
    },
  });

  const filteredPayments = (payments ?? []).filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.month.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === PAYMENT_STATUS_FILTER.ALL || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPaid = (payments ?? [])
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = (payments ?? [])
    .filter((p) => p.status === PAYMENT_STATUS.PENDING)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = (payments ?? [])
    .filter((p) => p.status === PAYMENT_STATUS.OVERDUE)
    .reduce((sum, p) => sum + p.amount, 0);

  const studentsForPayment = (students ?? []).map((student) => ({
    id: student.id,
    monthlyFee: student.monthlyFee,
    name: student.name,
  }));

  const handleMarkPaid = (paymentId: string) => {
    markPaymentStatusMutation({
      id: paymentId,
      status: PAYMENT_STATUS.PAID,
    });
  };

  return (
    <div className="space-y-6">
      <PaymentsHeader onRecordPayment={() => setIsRecordPaymentOpen(true)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Paid"
          content={`₹${totalPaid.toLocaleString()}`}
          variant={VARIANTS.SUCCESS}
        />
        <SummaryCard
          title="Pending"
          content={`₹${totalPending.toLocaleString()}`}
          variant={VARIANTS.DEFAULT}
        />
        <SummaryCard
          title="Overdue"
          content={`₹${totalOverdue.toLocaleString()}`}
          variant={VARIANTS.ERROR}
        />
      </div>
      <PaymentSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={statusFilter}
        onFilterChange={setStatusFilter}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPayments.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} onMarkPaid={handleMarkPaid} />
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <EmptyState
          className="h-full text-gray-400 border-none shadow-none"
          icon={<Filter className="h-12 w-12" />}
          title={t('empty.title')}
          description=""
        />
      )}
      <RecordPaymentForm
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onRecordPayment={createPaymentMutation}
        students={studentsForPayment}
      />
    </div>
  );
}

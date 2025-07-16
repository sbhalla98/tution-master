'use client';

import { EmptyState } from '@/components/illustration/empty-state';
import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { Payment } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { PAYMENT_STATUS_FILTER } from '../constants';
import { PaymentStatusFilterType } from '../types';
import PaymentCardContainer from './payment-card-container';
import PaymentsHeader from './payments-header';
import PaymentSearchFilter from './payments-search-filter';
import RecordPaymentContainer from './record-payment-container';
import SummaryCard, { VARIANTS } from './summary-card';

type PaymentsContainerProps = {
  payments?: Payment[] | null;
};
export default function PaymentsContainer({ payments }: PaymentsContainerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilterType>(
    PAYMENT_STATUS_FILTER.ALL
  );
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations('payments');

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
          <PaymentCardContainer key={payment.id} payment={payment} />
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
      <RecordPaymentContainer isOpen={isRecordPaymentOpen} setIsOpen={setIsRecordPaymentOpen} />
    </div>
  );
}

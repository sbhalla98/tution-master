'use client';

import PaymentCard from '@/components/payment-card';
import RecordPaymentForm from '@/components/record-payment-form';
import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { createPayment, markPaymentStatus } from '@/lib/api';
import { Payment, Student } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import { PAYMENT_STATUS_FILTER } from '../constants';
import { PaymentStatusFilterType } from '../types';
import PaymentsHeader from './payments-header';
import PaymentSearchFilter from './payments-search-filter';

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="text-sm font-medium text-green-700">Total Paid</h3>
          <p className="text-2xl font-bold text-green-900">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
          <p className="text-2xl font-bold text-yellow-900">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <h3 className="text-sm font-medium text-red-700">Overdue</h3>
          <p className="text-2xl font-bold text-red-900">₹{totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      <PaymentSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Payments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPayments.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} onMarkPaid={handleMarkPaid} />
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No payments found matching your criteria</p>
        </div>
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

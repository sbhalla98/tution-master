'use client';

import PaymentCard from '@/components/PaymentCard';
import RecordPaymentForm from '@/components/RecordPaymentForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { createPayment, markPaymentStatus } from '@/lib/api';
import { Payment, Student } from '@/types';
import { CreatePaymentRequest } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { PAYMENT_STATUS_FILTER } from '../constants';
import { PaymentStatusFilterType } from '../types';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: 'Payment recorded successfully',
        title: 'Payment Recorded',
      });
    },
    onError: () => {
      toast({
        description: 'Failed to record payment. Please try again.',
        title: 'Error',
        variant: 'destructive',
      });
    },
  });

  const { mutate: markPaymentStatusMutation } = useMutation({
    mutationFn: markPaymentStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: 'Payment marked as paid successfully',
        title: 'Payment Updated',
      });
    },
    onError: (error) => {
      toast({
        description: 'Failed to mark payment as paid. Please try again.',
        title: 'Error',
        variant: 'destructive',
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

  const handleMarkPaid = (paymentId: string) => {
    markPaymentStatusMutation({
      id: paymentId,
      status: PAYMENT_STATUS.PAID,
    });
  };

  const handleRecordPayment = (newPaymentData: CreatePaymentRequest) => {
    createPaymentMutation(newPaymentData);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track and manage student payments</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsRecordPaymentOpen(true)}>
          <Plus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === PAYMENT_STATUS_FILTER.ALL ? 'default' : 'outline'}
            onClick={() => setStatusFilter(PAYMENT_STATUS_FILTER.ALL)}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === PAYMENT_STATUS_FILTER.PAID ? 'default' : 'outline'}
            onClick={() => setStatusFilter(PAYMENT_STATUS_FILTER.PAID)}
            size="sm"
          >
            Paid
          </Button>
          <Button
            variant={statusFilter === PAYMENT_STATUS_FILTER.PENDING ? 'default' : 'outline'}
            onClick={() => setStatusFilter(PAYMENT_STATUS_FILTER.PENDING)}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === PAYMENT_STATUS_FILTER.OVERDUE ? 'default' : 'outline'}
            onClick={() => setStatusFilter(PAYMENT_STATUS_FILTER.OVERDUE)}
            size="sm"
          >
            Overdue
          </Button>
        </div>
      </div>

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
        onRecordPayment={handleRecordPayment}
        students={studentsForPayment}
      />
    </div>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { PAYMENT_STATUS } from '@/constants';
import { RecordPaymentFormData, recordPaymentSchema } from '@/schemas/payment.schema';
import { CreatePaymentRequest } from '@/types/api';

import FormInput from './form-input';
import FormSelect from './form-select';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface RecordPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (payment: CreatePaymentRequest) => void;
  students: Array<{ id: string; name: string; monthlyFee: number }>;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function RecordPaymentForm({
  isOpen,
  onClose,
  onRecordPayment,
  students,
}: RecordPaymentFormProps) {
  const t = useTranslations('paymentForm');

  const form = useForm<RecordPaymentFormData>({
    defaultValues: {
      status: PAYMENT_STATUS.PAID,
      year: new Date().getFullYear(),
    },
    resolver: zodResolver(recordPaymentSchema),
  });

  const selectedStudentId = form.watch('studentId');
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const onSubmit = (data: RecordPaymentFormData) => {
    const newPayment: CreatePaymentRequest = {
      amount: Number(data.amount),
      dueDate: data.dueDate,
      month: data.month,
      paymentDate: data.status === PAYMENT_STATUS.PAID ? new Date().toISOString() : undefined,
      status: data.status,
      studentId: data.studentId,
      studentName: selectedStudent?.name || '',
      year: Number(data.year),
    };

    onRecordPayment(newPayment);
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (selectedStudent?.monthlyFee) {
      form.setValue('amount', selectedStudent.monthlyFee);
    }
  }, [selectedStudent]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormSelect
              name="studentId"
              label={t('student')}
              placeholder={t('selectStudent')}
              options={students.map((s) => ({ label: s.name, value: s.id }))}
              control={form.control}
            />
            <FormSelect
              name="month"
              label={t('month')}
              placeholder={t('selectMonth')}
              options={months.map((m) => ({ label: m, value: m }))}
              control={form.control}
            />
            <FormInput
              name="year"
              label={t('year')}
              placeholder={t('enterYear')}
              type="number"
              control={form.control}
            />
            <FormInput
              name="amount"
              label={t('amount')}
              placeholder={t('enterAmount')}
              type="number"
              control={form.control}
            />
            <FormInput
              name="dueDate"
              label={t('dueDate')}
              placeholder={t('selectDueDate')}
              type="date"
              control={form.control}
            />
            <FormSelect
              name="status"
              label={t('status')}
              placeholder={t('selectStatus')}
              options={Object.values(PAYMENT_STATUS).map((status) => ({
                label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
                value: status,
              }))}
              control={form.control}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button type="submit">{t('submit')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

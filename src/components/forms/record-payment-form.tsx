'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { AppSheet } from '@/components/app-sheet';
import FormInput from '@/components/form-input';
import FormSelect from '@/components/form-select';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { MONTHS, PAYMENT_STATUS } from '@/constants';
import { RecordPaymentFormData, recordPaymentSchema } from '@/schemas/payment.schema';
import { CreatePaymentRequest } from '@/types/api';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface RecordPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (payment: CreatePaymentRequest) => void;
  students: Array<{ id: string; name: string; monthlyFee: number }>;
}

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
  };

  useEffect(() => {
    if (selectedStudent?.monthlyFee) {
      form.setValue('amount', selectedStudent.monthlyFee);
    }
  }, [selectedStudent]);

  return (
    <AppSheet
      open={isOpen}
      onOpenChange={onClose}
      title={t('title')}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {t('submit')}
          </Button>
        </>
      }
    >
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
            options={Object.values(MONTHS)}
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
        </form>
      </Form>
    </AppSheet>
  );
}

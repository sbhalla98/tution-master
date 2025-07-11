'use client';

import SendRemindersForm from '@/components/forms/send-reminder-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PAYMENT_STATUS } from '@/constants';
import { Payment, PaymentStatusType } from '@/types';
import { Calendar, IndianRupee } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface PaymentCardProps {
  payment: Payment;
  onMarkPaid: (paymentId: string) => void;
}

export default function PaymentCard({ payment, onMarkPaid }: PaymentCardProps) {
  const t = useTranslations('payment');
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);

  const getStatusColor = (status: PaymentStatusType) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return 'bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-400';
      case PAYMENT_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-400';
      case PAYMENT_STATUS.OVERDUE:
        return 'bg-red-100 text-red-800 dark:bg-red-200/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-200/10 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{payment.studentName}</CardTitle>
          <CardDescription>
            {payment.month} {payment.year}
          </CardDescription>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            payment.status
          )}`}
        >
          {t(`status.${payment.status.toLowerCase()}`)}
        </span>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <IndianRupee className="h-4 w-4 mr-2" />
          {t('amount', { amount: payment.amount })}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {t('dueDate', { date: new Date(payment.dueDate).toLocaleDateString() })}
        </div>
        {payment.paymentDate && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {t('paidDate', { date: new Date(payment.paymentDate).toLocaleDateString() })}
          </div>
        )}
      </CardContent>

      {payment.status !== PAYMENT_STATUS.PAID && (
        <CardFooter className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsRemindersOpen(true)}>
            <FaWhatsapp />
            {t('remind')}
          </Button>
          <Button size="sm" onClick={() => onMarkPaid(payment.id)}>
            {t('markAsPaid')}
          </Button>
        </CardFooter>
      )}

      <SendRemindersForm
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        payments={[payment]}
        allowSelection={false}
      />
    </Card>
  );
}

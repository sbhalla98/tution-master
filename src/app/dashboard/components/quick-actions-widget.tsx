'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, DollarSign, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import AddStudentForm from '@/components/forms/add-student-form';
import RecordPaymentForm from '@/components/forms/record-payment-form';
import SendRemindersForm from '@/components/forms/send-reminder-form';

import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { createPayment, createStudent, getPayments, getStudents } from '@/lib/api';

type ActionButtonProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  bgColor: string;
  hoverColor: string;
  ariaLabel: string;
};

function ActionButton({
  icon,
  title,
  description,
  onClick,
  bgColor,
  hoverColor,
  ariaLabel,
}: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start p-4 rounded-lg ${bgColor} hover:${hoverColor} transition-colors h-auto`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <div className="flex items-center gap-3 text-left w-full">
        {icon}
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Button>
  );
}

export default function QuickActionsWidget() {
  const t = useTranslations('quickActions');
  const toast = useToast();
  const queryClient = useQueryClient();

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudents(),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: () => getPayments(),
  });

  const overduePaymentsList = (payments ?? []).filter((p) => p.status === PAYMENT_STATUS.OVERDUE);

  const { mutate: createStudentMutation } = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.toast({
        title: t('addStudent.successTitle'),
        description: t('addStudent.successDescription'),
      });
    },
    onError: () => {
      toast.toast({
        title: t('addStudent.errorTitle'),
        description: t('addStudent.errorDescription'),
        variant: 'destructive',
      });
    },
  });

  const { mutate: createPaymentMutation } = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.toast({
        title: t('recordPayment.successTitle'),
        description: t('recordPayment.successDescription'),
      });
    },
    onError: () => {
      toast.toast({
        title: t('recordPayment.errorTitle'),
        description: t('recordPayment.errorDescription'),
        variant: 'destructive',
      });
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ActionButton
            icon={<Users className="h-5 w-5 text-blue-600" />}
            title={t('addStudent.title')}
            description={t('addStudent.description')}
            onClick={() => setIsAddStudentOpen(true)}
            bgColor="bg-blue-50"
            hoverColor="bg-blue-100"
            ariaLabel={t('addStudent.title')}
          />
          <ActionButton
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            title={t('recordPayment.title')}
            description={t('recordPayment.description')}
            onClick={() => setIsRecordPaymentOpen(true)}
            bgColor="bg-green-50"
            hoverColor="bg-green-100"
            ariaLabel={t('recordPayment.title')}
          />
          <ActionButton
            icon={<AlertCircle className="h-5 w-5 text-yellow-600" />}
            title={t('sendReminders.title')}
            description={t('sendReminders.description')}
            onClick={() => setIsRemindersOpen(true)}
            bgColor="bg-yellow-50"
            hoverColor="bg-yellow-100"
            ariaLabel={t('sendReminders.title')}
          />
        </CardContent>
      </Card>

      <AddStudentForm
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={createStudentMutation}
      />
      <RecordPaymentForm
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onRecordPayment={createPaymentMutation}
        students={students ?? []}
      />
      <SendRemindersForm
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        payments={overduePaymentsList}
        allowSelection={true}
      />
    </>
  );
}

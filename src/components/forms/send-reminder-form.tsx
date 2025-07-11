'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateWhatsappReminder, sendWhatsappMessage } from '@/lib/whatsapp';
import { ReminderFormValues, reminderSchema } from '@/schemas/reminder.schema';
import { Payment, Student } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { FaWhatsapp } from 'react-icons/fa';
import { AppSheet } from '../app-sheet';
import MiniPaymentCard from '../cards/mini-payment-card';
import FormInput from '../form-input';

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payments: Payment[];
  allowSelection?: boolean;
}

export default function ReminderDialog({
  isOpen,
  onClose,
  payments,
  allowSelection = false,
}: ReminderDialogProps) {
  const t = useTranslations('sendReminderForm');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ReminderFormValues>({
    defaultValues: {
      message: t('message.defaultValue'),
      selectedId: allowSelection ? undefined : payments[0]?.id,
    },
    resolver: zodResolver(reminderSchema),
  });

  const onSubmit = async (data: ReminderFormValues) => {
    const selectedPayment = payments.find((p) => p.id === data.selectedId);

    if (!selectedPayment) {
      toast({
        description: t('errors.noPayment.description'),
        title: t('errors.noPayment.title'),
        variant: 'destructive',
      });
      return;
    }

    const cachedStudents = queryClient.getQueryData<Student[]>(['students']) || [];
    const student = cachedStudents.find((s) => s.id === selectedPayment.studentId);

    if (student?.phone) {
      const formattedMessage = generateWhatsappReminder(data.message, selectedPayment);
      const phone = student.phone.replace(/\D/g, '');
      sendWhatsappMessage(phone, formattedMessage);

      toast({
        description: t('success.reminderSent.description', { name: selectedPayment.studentName }),
        title: t('success.reminderSent.title'),
      });

      onClose();
    } else {
      toast({
        description: t('errors.noPhone.description', { name: selectedPayment.studentName }),
        title: t('errors.noPhone.title'),
        variant: 'destructive',
      });
    }
  };

  return (
    <AppSheet
      open={isOpen}
      onOpenChange={onClose}
      title={
        <>
          <FaWhatsapp className="h-6 w-6 text-green-600" />
          {t('title')}
        </>
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={allowSelection && !form.watch('selectedId')}
            className="bg-green-600 hover:bg-green-700"
          >
            <FaWhatsapp />
            {t('submit')}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form className="space-y-4">
          {allowSelection && (
            <FormField
              control={form.control}
              name="selectedId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('paymentSelection.label')}</FormLabel>
                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
                    {payments.map((p) => (
                      <MiniPaymentCard
                        key={p.id}
                        payment={p}
                        onClick={field.onChange}
                        highlight={field.value === p.id}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormInput
            name="message"
            label={t('message.label')}
            type="textarea"
            control={form.control}
            className="min-h-[200px]"
          />
          <p className="text-sm text-muted-foreground">{t('message.helpText')}</p>
        </form>
      </Form>
    </AppSheet>
  );
}

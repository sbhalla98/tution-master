'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Payment, Student } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { AppSheet } from '../app-sheet';

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payments: Payment[]; // can be 1 or more payments
  allowSelection?: boolean; // allow choosing 1 from list
}

export default function ReminderDialog({
  isOpen,
  onClose,
  payments,
  allowSelection = false,
}: ReminderDialogProps) {
  const t = useTranslations('sendReminderForm');
  const [selectedId, setSelectedId] = useState<string | null>(
    allowSelection ? null : payments[0]?.id
  );
  const [message, setMessage] = useState(
    'Dear Student,\n\nThis is a friendly reminder that your payment is overdue. Please make the payment at your earliest convenience.\n\nThank you!'
  );
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const selectedPayment = payments.find((p) => p.id === selectedId);

  const handleSendReminder = async () => {
    if (!selectedPayment) {
      toast({
        title: 'No payment selected',
        description: 'Please select a payment to send the reminder.',
        variant: 'destructive',
      });
      return;
    }

    const cachedStudents = queryClient.getQueryData<Student[]>(['students']) || [];
    const student = cachedStudents.find((s) => s.id === selectedPayment.studentId);

    if (student?.phone) {
      const formattedMessage = `${message}\n\nPayment Details:\n- Student: ${selectedPayment.studentName}\n- Month: ${selectedPayment.month} ${selectedPayment.year}\n- Amount: ₹${selectedPayment.amount}\n- Due Date: ${new Date(selectedPayment.dueDate).toLocaleDateString()}`;
      const phone = student.phone.replace(/\D/g, '');
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(formattedMessage)}`;

      window.open(url, '_blank');

      toast({
        title: 'Reminder sent!',
        description: `Opened WhatsApp for ${student.name}.`,
      });

      setSelectedId(null);
      onClose();
    } else {
      toast({
        title: 'Phone number not found',
        description: `Could not send reminder to ${selectedPayment.studentName}.`,
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
            onClick={handleSendReminder}
            disabled={!selectedPayment}
            className="bg-green-600 hover:bg-green-700"
          >
            <FaWhatsapp />
            {t('submit')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {allowSelection && (
          <div>
            <Label className="text-base font-medium mb-2 block">Select a Payment</Label>
            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded cursor-pointer border ${
                    selectedId === p.id ? 'bg-green-50 border-green-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <div className="font-medium">{p.studentName}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.month} {p.year} - ₹{p.amount} (Due:{' '}
                    {new Date(p.dueDate).toLocaleDateString()})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message">{t('message.label')}</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[200px]"
          />
          <p className="text-sm text-muted-foreground">{t('message.helpText')}</p>
        </div>
      </div>
    </AppSheet>
  );
}

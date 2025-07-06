import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getStudent } from '@/lib/api';
import { Payment } from '@/types/student';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface SendRemindersFormProps {
  isOpen: boolean;
  onClose: () => void;
  overduePayments: Payment[];
}

export default function SendRemindersForm({
  isOpen,
  onClose,
  overduePayments,
}: SendRemindersFormProps) {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [message, setMessage] = useState(
    'Dear Student,\n\nThis is a friendly reminder that your payment is overdue. Please make the payment at your earliest convenience.\n\nThank you!'
  );
  const { toast } = useToast();

  const handlePaymentToggle = (paymentId: string) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId) ? prev.filter((id) => id !== paymentId) : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === overduePayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(overduePayments.map((p) => p.id));
    }
  };

  const handleSendWhatsAppReminders = async () => {
    if (selectedPayments.length === 0) {
      toast({
        description: 'Please select at least one payment to send reminders for.',
        title: 'No payments selected',
        variant: 'destructive',
      });
      return;
    }

    const selectedPaymentData = overduePayments.filter((p) => selectedPayments.includes(p.id));
    let successCount = 0;

    // For each selected payment, open WhatsApp with the reminder message
    for (const payment of selectedPaymentData) {
      try {
        const student = await getStudent(payment.studentId);

        if (student && student.phone) {
          const formattedMessage = `${message}\n\nPayment Details:\n- Student: ${payment.studentName}\n- Month: ${payment.month} ${payment.year}\n- Amount: ₹${payment.amount}\n- Due Date: ${new Date(payment.dueDate).toLocaleDateString()}`;

          // Clean phone number (remove all non-digits)
          const cleanPhone = student.phone.replace(/\D/g, '');

          // Create WhatsApp deep link
          const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedMessage)}`;

          // Open WhatsApp in new tab
          window.open(whatsappUrl, '_blank');
          successCount++;
        } else {
          console.error(`No phone number found for student: ${payment.studentName}`);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }

    toast({
      description: `Opened ${successCount} WhatsApp chat(s) with reminder messages.`,
      title: 'WhatsApp reminders opened!',
    });

    setSelectedPayments([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Send WhatsApp Reminders
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">Overdue Payments</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedPayments.length === overduePayments.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
              {overduePayments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No overdue payments found</p>
              ) : (
                overduePayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                  >
                    <Checkbox
                      id={payment.id}
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={() => handlePaymentToggle(payment.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={payment.id} className="cursor-pointer">
                        <div className="font-medium">{payment.studentName}</div>
                        <div className="text-sm text-gray-600">
                          {payment.month} {payment.year} - ₹{payment.amount} (Due:{' '}
                          {new Date(payment.dueDate).toLocaleDateString()})
                        </div>
                      </Label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">WhatsApp Reminder Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your reminder message..."
              className="min-h-[120px]"
            />
            <p className="text-sm text-gray-500">
              Payment details will be automatically added to each message.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSendWhatsAppReminders}
              className="bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send via WhatsApp ({selectedPayments.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

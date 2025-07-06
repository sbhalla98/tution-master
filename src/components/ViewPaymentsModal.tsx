import PaymentCard from '@/components/PaymentCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getStudentPayments } from '@/lib/api';
import { Payment } from '@/types/student';
import { useEffect, useState } from 'react';

interface ViewPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
  studentName: string;
  onMarkPaid: (paymentId: string) => void;
}

export default function ViewPaymentsModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  onMarkPaid,
}: ViewPaymentsModalProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      loadStudentPayments();
    }
  }, [isOpen, studentId]);

  const loadStudentPayments = async () => {
    if (!studentId) return;

    setLoading(true);
    try {
      const studentPayments = await getStudentPayments(studentId);
      setPayments(studentPayments);
    } catch (error) {
      console.error('Error loading student payments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payments for {studentName}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No payments found for this student</div>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onMarkPaid={onMarkPaid} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

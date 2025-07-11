import PaymentCard from '@/components/payment-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getStudentPayments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

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
  const { data: payments, isLoading } = useQuery({
    enabled: isOpen && !!studentId,
    queryFn: () =>
      getStudentPayments({
        studentId: studentId!,
      }),
    queryKey: ['studentPayments', studentId],
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payments for {studentName}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading payments...</div>
        ) : (payments ?? []).length === 0 ? (
          <div className="text-center py-8 text-gray-500">No payments found for this student</div>
        ) : (
          <div className="grid gap-4">
            {(payments ?? []).map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onMarkPaid={onMarkPaid} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

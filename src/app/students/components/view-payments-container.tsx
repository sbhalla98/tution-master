import ViewPaymentsModal from '@/components/view-payment-modal';
import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { markPaymentStatus } from '@/lib/api';
import { Student } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type ViewPaymentsContainerProps = {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
};
export default function ViewPaymentsContainer({
  isOpen,
  onClose,
  student,
}: ViewPaymentsContainerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('students.viewPayments');

  const { mutate: markPaymentStatusMutation } = useMutation({
    mutationFn: markPaymentStatus,
    onError: () => {
      toast({
        description: t('error.description'),
        title: t('error.title'),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: t('success.description'),
        title: t('success.title'),
      });
    },
  });

  const handleMarkPaid = (paymentId: string) => {
    markPaymentStatusMutation({
      id: paymentId,
      status: PAYMENT_STATUS.PAID,
    });
  };

  return (
    <ViewPaymentsModal
      isOpen={isOpen}
      onClose={onClose}
      studentId={student?.id || ''}
      studentName={student?.name || ''}
      onMarkPaid={handleMarkPaid}
    />
  );
}

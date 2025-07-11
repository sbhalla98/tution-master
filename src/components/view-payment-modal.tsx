import PaymentCard from '@/components/cards/payment-card';
import { getStudentPayments } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { AppSheet } from './app-sheet';
import { EmptyState } from './illustration/empty-state';
import PaymentCardSkeleton from './skeleton/payment-card-skeleton';

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
  const t = useTranslations('viewPaymentsModal');
  const { data: payments, isLoading } = useQuery({
    enabled: isOpen && !!studentId,
    queryFn: () =>
      getStudentPayments({
        studentId: studentId!,
      }),
    queryKey: ['studentPayments', studentId],
  });

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="grid gap-4">
          <PaymentCardSkeleton />
          <PaymentCardSkeleton />
          <PaymentCardSkeleton />
        </div>
      );
    if ((payments ?? []).length === 0)
      return (
        <EmptyState
          className="h-full"
          title={t('empty.title')}
          description={t('empty.description')}
        />
      );
    return (
      <div className="grid gap-4">
        {(payments ?? []).map((payment) => (
          <PaymentCard key={payment.id} payment={payment} onMarkPaid={onMarkPaid} />
        ))}
      </div>
    );
  };

  return (
    <AppSheet open={isOpen} onOpenChange={onClose} title={t('title', { studentName })}>
      {renderContent()}
    </AppSheet>
  );
}

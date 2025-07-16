import PaymentCard from '@/components/cards/payment-card';
import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { markPaymentStatus } from '@/lib/api';
import { Payment } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type PaymentCardContainerProps = {
  payment: Payment;
};
export default function PaymentCardContainer({ payment }: PaymentCardContainerProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations('payment.card.markAsPaid');

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

  return <PaymentCard payment={payment} onMarkPaid={handleMarkPaid} />;
}

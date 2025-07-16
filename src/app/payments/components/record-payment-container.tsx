import { AppSheet } from '@/components/app-sheet';
import RecordPaymentForm from '@/components/forms/record-payment-form';
import { ErrorState } from '@/components/illustration/error-state';
import { useToast } from '@/hooks/use-toast';
import { createPayment, getStudents } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type RecordPaymentContainerProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};
export default function RecordPaymentContainer({ isOpen, setIsOpen }: RecordPaymentContainerProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations('paymentFormContainer');

  const { data, error, isFetching, refetch } = useQuery({
    queryFn: () => getStudents(),
    queryKey: ['students'],
  });

  const { mutate: createPaymentMutation } = useMutation({
    mutationFn: createPayment,
    onError: () => {
      toast({
        description: t('record.error.description'),
        title: t('record.error.title'),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: t('record.success.description'),
        title: t('record.success.title'),
      });
    },
  });

  if (isFetching) {
    // [TODO] add skeleton loader
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <AppSheet open={isOpen} onOpenChange={() => setIsOpen(false)} title={t('error.title')}>
        <ErrorState className="h-full" onReload={refetch} />
      </AppSheet>
    );
  }

  return (
    <RecordPaymentForm
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onRecordPayment={createPaymentMutation}
      students={data || []}
    />
  );
}

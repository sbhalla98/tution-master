import { AppSheet } from '@/components/app-sheet';
import RecordPaymentForm from '@/components/forms/record-payment-form';
import { ErrorState } from '@/components/illustration/error-state';
import { useToast } from '@/hooks/use-toast';
import { createPayment, getStudents } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type RecordPaymentContainerProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function RecordPaymentContainer({ isOpen, onClose }: RecordPaymentContainerProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations('payments.record');

  const { data, error, isFetching, refetch } = useQuery({
    queryFn: () => getStudents(),
    queryKey: ['students'],
  });

  const { mutate: createPaymentMutation } = useMutation({
    mutationFn: createPayment,
    onError: () => {
      toast({
        description: t('create.error.description'),
        title: t('create.error.title'),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: t('create.success.description'),
        title: t('create.success.title'),
      });
      onClose();
    },
  });

  if (isFetching) {
    // [TODO] add skeleton loader
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <AppSheet open={isOpen} onOpenChange={onClose} title={t('error.title')}>
        <ErrorState className="h-full" onReload={refetch} />
      </AppSheet>
    );
  }

  return (
    <RecordPaymentForm
      isOpen={isOpen}
      onClose={onClose}
      onRecordPayment={createPaymentMutation}
      students={data || []}
    />
  );
}

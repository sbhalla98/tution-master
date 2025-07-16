import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
  onRecordPayment: () => void;
};

export default function PaymentsHeader({ onRecordPayment }: Props) {
  const t = useTranslations('payments.header');

  return (
    <Header title={t('title')} description={t('description')}>
      <Button className="flex items-center gap-2" onClick={onRecordPayment}>
        <Plus className="h-4 w-4" />
        {t('buttonText')}
      </Button>
    </Header>
  );
}

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Props = {
  onRecordPayment: () => void;
};

export default function PaymentsHeader({ onRecordPayment }: Props) {
  return (
    <Header title="Payments" description="Manage your payment records">
      <Button className="flex items-center gap-2" onClick={onRecordPayment}>
        <Plus className="h-4 w-4" />
        Record Payment
      </Button>
    </Header>
  );
}

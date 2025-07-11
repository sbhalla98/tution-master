import { Payment } from '@/types';

interface MiniPaymentCardProps {
  payment: Payment;
  onClick: (id: string) => void;
  highlight?: boolean;
}

export default function MiniPaymentCard({ payment, onClick, highlight }: MiniPaymentCardProps) {
  return (
    <div
      key={payment.id}
      className={`p-3 rounded cursor-pointer border ${
        highlight ? 'bg-green-50 border-green-600' : 'hover:bg-gray-50'
      }`}
      onClick={() => onClick(payment.id)}
    >
      <div className="font-medium">{payment.studentName}</div>
      <div className="text-sm text-muted-foreground">
        {payment.month} {payment.year} - ₹{payment.amount} (Due:{' '}
        {new Date(payment.dueDate).toLocaleDateString()})
      </div>
    </div>
  );
}

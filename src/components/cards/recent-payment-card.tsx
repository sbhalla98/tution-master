import { Card, CardContent } from '@/components/ui/card';
import { Payment } from '@/types';

type RecentPaymentCardProps = {
  payment: Payment;
};

export default function RecentPaymentCard({ payment }: RecentPaymentCardProps) {
  return (
    <Card>
      <CardContent className="p-3 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">{payment.studentName}</p>
          <p className="text-sm text-gray-600">
            {payment.month} {payment.year}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">₹{payment.amount}</p>
          <p className="text-xs text-gray-500">
            {new Date(payment.paymentDate!).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

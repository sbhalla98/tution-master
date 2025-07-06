import { Button } from '@/components/ui/button';
import { PAYMENT_STATUS } from '@/constants';
import { Payment } from '@/types';
import { Calendar, IndianRupee } from 'lucide-react';

interface PaymentCardProps {
  payment: Payment;
  onMarkPaid: (paymentId: string) => void;
}

export default function PaymentCard({ payment, onMarkPaid }: PaymentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{payment.studentName}</h3>
          <p className="text-sm text-gray-600">
            {payment.month} {payment.year}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
        >
          {payment.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <IndianRupee className="h-4 w-4 mr-2" />
          Amount: ₹{payment.amount}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          Due: {new Date(payment.dueDate).toLocaleDateString()}
        </div>
        {payment.paymentDate && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Paid: {new Date(payment.paymentDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {payment.status !== PAYMENT_STATUS.PAID && (
        <Button size="sm" onClick={() => onMarkPaid(payment.id)} className="w-full">
          Mark as Paid
        </Button>
      )}
    </div>
  );
}

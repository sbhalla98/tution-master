'use client';
import { Payment } from '@/types';

type Props = {
  recentPayments?: Payment[] | null;
};
export default function RecentPaymentsWidget({ recentPayments }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Payments</h2>
      <div className="space-y-3">
        {(recentPayments ?? []).map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
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
          </div>
        ))}
      </div>
    </div>
  );
}

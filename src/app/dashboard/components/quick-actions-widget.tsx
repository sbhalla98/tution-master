'use client';
import { AlertCircle, DollarSign, Users } from 'lucide-react';

type Props = {
  onAddStudent: (open: boolean) => void;
  onRecordPayment: (open: boolean) => void;
  onSendReminders: (open: boolean) => void;
};
export default function QuickActionsWidget({
  onAddStudent,
  onRecordPayment,
  onSendReminders,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <button
          className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          onClick={() => onAddStudent(true)}
        >
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Add New Student</p>
              <p className="text-sm text-gray-600">Register a new student</p>
            </div>
          </div>
        </button>

        <button
          className="w-full text-left p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          onClick={() => onRecordPayment(true)}
        >
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Record Payment</p>
              <p className="text-sm text-gray-600">Mark payment as received</p>
            </div>
          </div>
        </button>

        <button
          className="w-full text-left p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          onClick={() => onSendReminders(true)}
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Send Reminders</p>
              <p className="text-sm text-gray-600">Notify overdue payments</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

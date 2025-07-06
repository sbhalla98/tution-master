'use client';
import AddStudentForm from '@/components/AddStudentForm';
import RecordPaymentForm from '@/components/RecordPaymentForm';
import SendRemindersForm from '@/components/SendRemindersForm';
import StatCard from '@/components/StatCard';
import { PAYMENT_STATUS, STUDENT_STATUS } from '@/constants';
import { createPayment, createStudent } from '@/lib/api';
import { Payment, Student } from '@/types';
import { AlertCircle, DollarSign, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

type DashboardContainerProps = {
  students: Student[];
  payments: Payment[];
};

export default function DashboardContainer({ students, payments }: DashboardContainerProps) {
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const activeStudents = students.filter((s) => s.status === STUDENT_STATUS.ACTIVE).length;
  const totalRevenue = payments
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter((p) => p.status === PAYMENT_STATUS.PENDING).length;
  const overduePayments = payments.filter((p) => p.status === PAYMENT_STATUS.OVERDUE).length;

  const recentPayments = payments
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
    .slice(0, 5);

  const overduePaymentsList = payments.filter((p) => p.status === PAYMENT_STATUS.OVERDUE);

  const handleAddStudent = async (newStudentData: Omit<Student, 'id'>) => {
    try {
      const newStudent = await createStudent(newStudentData);
      //   setStudents((prev) => [...prev, newStudent]);
      console.log('Added new student:', newStudent);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleRecordPayment = async (newPaymentData: Omit<Payment, 'id'>) => {
    try {
      const newPayment = await createPayment(newPaymentData);
      //   setPayments((prev) => [...prev, newPayment]);
      console.log('Recorded new payment:', newPayment);
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const studentsForPayment = students.map((student) => ({
    id: student.id,
    monthlyFee: student.monthlyFee,
    name: student.name,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here is your tuition overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon={Users}
          change="+2 this month"
          changeType="positive"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          change="+12% from last month"
          changeType="positive"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          icon={TrendingUp}
          change="Due this month"
          changeType="neutral"
        />
        <StatCard
          title="Overdue Payments"
          value={overduePayments}
          icon={AlertCircle}
          change="Needs attention"
          changeType="negative"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              onClick={() => setIsAddStudentOpen(true)}
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
              onClick={() => setIsRecordPaymentOpen(true)}
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
              onClick={() => setIsRemindersOpen(true)}
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
      </div>

      <SendRemindersForm
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        overduePayments={overduePaymentsList}
      />

      <AddStudentForm
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
      />

      <RecordPaymentForm
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onRecordPayment={handleRecordPayment}
        students={studentsForPayment}
      />
    </div>
  );
}

'use client';
import { PAYMENT_STATUS } from '@/constants';
import { Payment, Student } from '@/types';
import { BarChart3, IndianRupee, TrendingUp, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ReportsContiainerProps = {
  students?: Student[];
  payments?: Payment[];
};

export default function Reports({ students = [], payments = [] }: ReportsContiainerProps) {
  // Monthly revenue data
  const monthlyRevenue = payments
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .reduce(
      (acc, payment) => {
        const key = `${payment.month} ${payment.year}`;
        acc[key] = (acc[key] || 0) + payment.amount;
        return acc;
      },
      {} as Record<string, number>
    );

  const revenueData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  // Subject distribution - handle subjects as array
  const subjectData = students.reduce(
    (acc, student) => {
      student.subjects.forEach((subject) => {
        acc[subject] = (acc[subject] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData = Object.entries(subjectData).map(([subject, count]) => ({
    name: subject,
    value: count,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Insights into your tuition business</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-full">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹
                {payments
                  .filter((p) => p.status === PAYMENT_STATUS.PAID)
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Fee</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{Math.round(students.reduce((sum, s) => sum + s.monthlyFee, 0) / students.length)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Payment Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  (payments.filter((p) => p.status === PAYMENT_STATUS.PAID).length /
                    payments.length) *
                    100
                )}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Students by Subject</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Top Performing Months</h3>
            <div className="space-y-2">
              {Object.entries(monthlyRevenue)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([month, revenue]) => (
                  <div
                    key={month}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{month}</span>
                    <span className="text-green-600 font-semibold">₹{revenue}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Subject Popularity</h3>
            <div className="space-y-2">
              {Object.entries(subjectData)
                .sort(([, a], [, b]) => b - a)
                .map(([subject, count]) => (
                  <div
                    key={subject}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{subject}</span>
                    <span className="text-blue-600 font-semibold">{count} students</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

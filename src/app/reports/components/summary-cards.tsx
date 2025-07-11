import { BarChart3, IndianRupee, TrendingUp, Users } from 'lucide-react';

export type Summary = {
  totalStudents: number;
  totalRevenue: number;
  avgFee: number;
  paymentRate: number;
};

type Props = {
  summary: Summary;
};

const cardConfig = [
  {
    bg: 'bg-blue-50',
    icon: Users,
    label: 'Total Students',
    text: 'text-blue-600',
    value: (summary: Summary) => summary.totalStudents,
  },
  {
    bg: 'bg-green-50',
    icon: IndianRupee,
    label: 'Total Revenue',
    text: 'text-green-600',
    value: (summary: Summary) => `₹${summary.totalRevenue.toLocaleString()}`,
  },
  {
    bg: 'bg-yellow-50',
    icon: TrendingUp,
    label: 'Average Fee',
    text: 'text-yellow-600',
    value: (summary: Summary) => `₹${summary.avgFee}`,
  },
  {
    bg: 'bg-purple-50',
    icon: BarChart3,
    label: 'Payment Rate',
    text: 'text-purple-600',
    value: (summary: Summary) => `${summary.paymentRate}%`,
  },
];

export default function SummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardConfig.map((card) => (
        <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${card.bg}`}>
              <card.icon className={`h-6 w-6 ${card.text}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value(summary)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
    label: 'Total Students',
    icon: Users,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    value: (summary: Summary) => summary.totalStudents,
  },
  {
    label: 'Total Revenue',
    icon: IndianRupee,
    bg: 'bg-green-50',
    text: 'text-green-600',
    value: (summary: Summary) => `₹${summary.totalRevenue.toLocaleString()}`,
  },
  {
    label: 'Average Fee',
    icon: TrendingUp,
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    value: (summary: Summary) => `₹${summary.avgFee}`,
  },
  {
    label: 'Payment Rate',
    icon: BarChart3,
    bg: 'bg-purple-50',
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

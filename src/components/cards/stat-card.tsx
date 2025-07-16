import { LucideIcon } from 'lucide-react';

export const CHANGE_TYPE = {
  NEGATIVE: 'NEGATIVE',
  NEUTRAL: 'NEUTRAL',
  POSITIVE: 'POSITIVE',
} as const;

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: (typeof CHANGE_TYPE)[keyof typeof CHANGE_TYPE];
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = CHANGE_TYPE.NEUTRAL,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                changeType === CHANGE_TYPE.POSITIVE
                  ? 'text-green-600'
                  : changeType === CHANGE_TYPE.NEGATIVE
                    ? 'text-red-600'
                    : 'text-gray-600'
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

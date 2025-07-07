type Props = {
  topMonths: { month: string; revenue: number }[];
  subjectStats: Record<string, number>;
};

export default function KeyInsights({ topMonths, subjectStats }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Months */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Top Performing Months</h3>
          <div className="space-y-2">
            {topMonths.map(({ month, revenue }) => (
              <div
                key={month}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{month}</span>
                <span className="text-green-600 font-semibold">₹{revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Popularity */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Subject Popularity</h3>
          <div className="space-y-2">
            {Object.entries(subjectStats)
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
  );
}

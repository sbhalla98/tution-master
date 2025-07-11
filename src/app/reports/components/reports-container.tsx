'use client';

import { Payment, Student } from '@/types';
import useReportMetrics from '../hooks/use-report-metrics';
import KeyInsights from './key-insights';
import ReportsHeader from './reports-header';
import RevenueChart from './revenue-chart';
import SubjectPieChart from './subject-pie-chart';
import SummaryCards from './summary-cards';
import TimeFilterDropdown from './time-filter-dropdown';

export type ReportsProps = {
  students?: Student[] | null;
  payments?: Payment[] | null;
};

export default function Reports({ students, payments }: ReportsProps) {
  const { timeFilter, setTimeFilter, summary, revenueData, pieData, topMonths, subjectStats } =
    useReportMetrics({ payments: payments ?? [], students: students ?? [] });

  return (
    <div className="space-y-8">
      <ReportsHeader />

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Reports Overview</h2>
        <TimeFilterDropdown value={timeFilter} onChange={setTimeFilter} />
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart data={revenueData} />
        <SubjectPieChart data={pieData} />
      </div>

      <KeyInsights topMonths={topMonths} subjectStats={subjectStats} />
    </div>
  );
}

// reports/use-report-metrics.ts
import { PAYMENT_STATUS } from '@/constants';
import { Payment, Student } from '@/types';
import {
  endOfMonth,
  endOfYear,
  isWithinInterval,
  parse,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns';
import { useMemo, useState } from 'react';
import { TimeFilter } from '../types';

export default function useReportMetrics({
  students = [],
  payments = [],
}: {
  students?: Student[];
  payments?: Payment[];
}) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('current_month');

  const filteredPayments = useMemo(() => {
    if (timeFilter === 'all_time') return payments;

    const now = new Date();
    let range: { start: Date; end: Date };

    switch (timeFilter) {
      case 'current_month':
        range = { end: endOfMonth(now), start: startOfMonth(now) };
        break;
      case 'last_month':
        const lastMonth = subMonths(now, 1);
        range = { end: endOfMonth(lastMonth), start: startOfMonth(lastMonth) };
        break;
      case 'current_year':
        range = { end: endOfYear(now), start: startOfYear(now) };
        break;
      case 'last_year':
        const lastYear = subYears(now, 1);
        range = { end: endOfYear(lastYear), start: startOfYear(lastYear) };
        break;
      default:
        return payments;
    }

    return payments.filter((p) => {
      const date = parse(`${p.month} ${p.year}`, 'MMMM yyyy', new Date());
      return isWithinInterval(date, range);
    });
  }, [payments, timeFilter]);

  const monthlyRevenue = useMemo(() => {
    return filteredPayments
      .filter((p) => p.status === PAYMENT_STATUS.PAID)
      .reduce(
        (acc, p) => {
          const key = `${p.month} ${p.year}`;
          acc[key] = (acc[key] || 0) + p.amount;
          return acc;
        },
        {} as Record<string, number>
      );
  }, [filteredPayments]);

  const revenueData = useMemo(() => {
    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({
        date: parse(month, 'MMMM yyyy', new Date()),
        month,
        revenue,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [monthlyRevenue]);

  const subjectStats = useMemo(() => {
    return students.reduce(
      (acc, student) => {
        (student.subjects || []).forEach((subject) => {
          acc[subject] = (acc[subject] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );
  }, [students]);

  const pieData = useMemo(() => {
    return Object.entries(subjectStats).map(([subject, value]) => ({ name: subject, value }));
  }, [subjectStats]);

  const totalStudents = students.length;
  const totalRevenue = filteredPayments
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + p.amount, 0);
  const avgFee =
    totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + s.monthlyFee, 0) / totalStudents)
      : 0;
  const totalPaid = filteredPayments.filter((p) => p.status === PAYMENT_STATUS.PAID).length;
  const paymentRate =
    filteredPayments.length > 0 ? Math.round((totalPaid / filteredPayments.length) * 100) : 0;

  const summary = {
    avgFee,
    paymentRate,
    totalRevenue,
    totalStudents,
  };

  const topMonths = useMemo(() => {
    return Object.entries(monthlyRevenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([month, revenue]) => ({ month, revenue }));
  }, [monthlyRevenue]);

  return {
    pieData,
    revenueData,
    setTimeFilter,
    subjectStats,
    summary,
    timeFilter,
    topMonths,
  };
}

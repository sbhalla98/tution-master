import StatCard, { CHANGE_TYPE } from '@/components/cards/stat-card';
import { ErrorState } from '@/components/illustration/error-state';
import StatCardSkeleton from '@/components/skeleton/stat-card-skeleton';
import { getRevenueDetails } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { IndianRupee } from 'lucide-react';

export default function TotalRevenueWidgetContainer() {
  const { data, error, isFetching, refetch } = useQuery({
    queryFn: getRevenueDetails,
    queryKey: ['revenueDetails'],
  });

  const { thisMonthRevenue = 0, lastMonthRevenue = 0 } = data ?? {};
  const statLabel = `₹${thisMonthRevenue.toLocaleString()}`;

  const getChangeConfig = () => {
    const diff = Math.round((thisMonthRevenue / lastMonthRevenue) * 100) - 100;

    if (lastMonthRevenue === 0) {
      if (thisMonthRevenue === 0) {
        return {
          change: 'No revenue last month',
          changeType: CHANGE_TYPE.NEUTRAL,
        };
      }
      return {
        change: 'New revenue this month',
        changeType: CHANGE_TYPE.POSITIVE,
      };
    }

    if (diff === 0) {
      return {
        change: 'No change',
        changeType: CHANGE_TYPE.NEUTRAL,
      };
    }

    if (diff > 0) {
      return {
        change: `+${diff}% from last month`,
        changeType: CHANGE_TYPE.POSITIVE,
      };
    }

    return {
      change: `${diff}% from last month`,
      changeType: CHANGE_TYPE.NEGATIVE,
    };
  };

  const changeConfig = getChangeConfig();

  if (isFetching) {
    return <StatCardSkeleton />;
  }

  if (error) {
    return <ErrorState title="" description="Failed to fetch revenue details" onReload={refetch} />;
  }

  return (
    <StatCard
      title="Total Revenue"
      value={statLabel}
      icon={IndianRupee}
      change={changeConfig.change}
      changeType={changeConfig.changeType}
    />
  );
}

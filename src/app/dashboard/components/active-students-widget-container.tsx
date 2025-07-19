import StatCard, { CHANGE_TYPE } from '@/components/cards/stat-card';
import { ErrorState } from '@/components/illustration/error-state';
import StatCardSkeleton from '@/components/skeleton/stat-card-skeleton';
import { getActiveStudents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';

export default function ActiveStudentsWidgetContainer() {
  const { data, error, isFetching, refetch } = useQuery({
    queryFn: getActiveStudents,
    queryKey: ['activeStudents'],
  });

  const { currentActiveCount = 0, activeAtEndOfLastMonth = 0 } = data ?? {};

  const getChangeConfig = () => {
    const diff = currentActiveCount - activeAtEndOfLastMonth;

    if (diff === 0) {
      return {
        change: 'No change',
        changeType: CHANGE_TYPE.NEUTRAL,
      };
    }

    if (diff > 0) {
      return {
        change: `+${diff} this month`,
        changeType: CHANGE_TYPE.POSITIVE,
      };
    }

    return {
      change: `${diff} this month`,
      changeType: CHANGE_TYPE.NEGATIVE,
    };
  };

  const changeConfig = getChangeConfig();

  if (isFetching) {
    return <StatCardSkeleton />;
  }

  if (error) {
    return <ErrorState title="" description="Failed to fetch active students" onReload={refetch} />;
  }

  return (
    <StatCard
      title="Active Students"
      value={currentActiveCount}
      icon={Users}
      change={changeConfig.change}
      changeType={changeConfig.changeType}
    />
  );
}

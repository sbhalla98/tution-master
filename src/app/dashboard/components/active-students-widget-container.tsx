import StatCard, { CHANGE_TYPE } from '@/components/cards/stat-card';
import { getActiveStudents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';

export default function ActiveStudentsWidgetContainer() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['activeStudents'],
    queryFn: getActiveStudents,
  });

  const { currentActiveCount = 0, activeAtEndOfLastMonth = 0 } = data ?? {};

  const getChangeConfig = () => {
    const diff = currentActiveCount - activeAtEndOfLastMonth;

    if (diff === 0) {
      return {
        changeType: CHANGE_TYPE.NEUTRAL,
        change: 'No change',
      };
    }

    if (diff > 0) {
      return {
        changeType: CHANGE_TYPE.POSITIVE,
        change: `+${diff} this month`,
      };
    }

    return {
      changeType: CHANGE_TYPE.NEGATIVE,
      change: `${diff} this month`, // already negative
    };
  };

  const changeConfig = getChangeConfig();

  if (isLoading) {
    // [TODO] add skeleton
    return <div>Loading ...</div>;
  }

  if (error) {
    // [TODO] add error handler
    return <div>error ...</div>;
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

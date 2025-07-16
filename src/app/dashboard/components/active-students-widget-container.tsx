import StatCard, { CHANGE_TYPE } from '@/components/cards/stat-card';
import { getActiveStudents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';

export default function ActiveStudentsWidgetContainer() {
  const { data, error, isLoading } = useQuery({
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
      changeType: CHANGE_TYPE.NEGATIVE, // already negative
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

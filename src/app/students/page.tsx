'use client';

import { ErrorState } from '@/components/illustration/error-state';
import StudentsContainerSkeleton from '@/components/skeleton/students-container-skeleton';
import { getStudents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import StudentsContainer from './components/students-container';

export default function Students() {
  const { data, error, isFetching, refetch } = useQuery({
    queryFn: () => getStudents(),
    queryKey: ['students'],
  });

  if (isFetching) {
    return <StudentsContainerSkeleton />;
  }

  if (error) {
    return <ErrorState className="h-full" onReload={refetch} />;
  }

  return <StudentsContainer students={data} />;
}

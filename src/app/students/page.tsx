'use client';

import StudentsContainerSkeleton from '@/components/skeleton/students-container-skeleton';
import { getStudents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import StudentsContainer from './components/students-container';

export default function Students() {
  const { data, error, isFetching } = useQuery({
    queryFn: () => getStudents(),
    queryKey: ['students'],
  });

  if (isFetching) {
    return <StudentsContainerSkeleton />;
  }

  if (error) {
    return <div>Error loading students: {error.message}</div>;
  }

  return <StudentsContainer students={data} />;
}

'use client';

import { getStudents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import StudentsContainer from './components/students-container';

export default function Students() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading students: {error.message}</div>;
  }

  return <StudentsContainer students={data} />;
}

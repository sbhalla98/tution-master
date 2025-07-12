'use client';

import RecentStudentCard from '@/components/cards/recent-student-card';
import { EmptyState } from '@/components/illustration/empty-state';
import { ErrorState } from '@/components/illustration/error-state';
import RecentStudentsSkeleton from '@/components/skeleton/recent-students-widget-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStudents } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

const RECENT_STUDENTS_LIMIT = 5;

export default function RecentStudentsWidget() {
  const t = useTranslations('recentStudentsWidget');

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: () => getStudents(RECENT_STUDENTS_LIMIT),
    queryKey: ['students', RECENT_STUDENTS_LIMIT],
  });

  const title = t('title');

  if (isLoading) {
    return <RecentStudentsSkeleton title={title} limit={RECENT_STUDENTS_LIMIT} />;
  }

  if (error) {
    return (
      <ErrorState
        className="h-full"
        title={t('error.title')}
        description={t('error.description')}
        onReload={refetch}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data && data?.length > 0 ? (
          data.map((student) => <RecentStudentCard key={student.id} student={student} />)
        ) : (
          <EmptyState
            className="h-full"
            title={t('empty.title')}
            description={t('empty.description')}
          />
        )}
      </CardContent>
    </Card>
  );
}

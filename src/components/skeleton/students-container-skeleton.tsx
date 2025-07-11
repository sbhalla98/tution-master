'use client';

import { Skeleton } from '@/components/ui/skeleton';
import StudentCardSkeleton from './student-card-skeleton';

export default function StudentsContainerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Search & Filter skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Skeleton className="h-9 w-full md:w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <StudentCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {/* Top section: name + badge */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" /> {/* student name */}
          <Skeleton className="h-3 w-20" /> {/* month & year */}
        </div>
        <Skeleton className="h-5 w-16 rounded-full" /> {/* status badge */}
      </div>

      {/* Payment details */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Mark as Paid button */}
      <Skeleton className="h-8 w-full rounded-md" />
    </div>
  );
}

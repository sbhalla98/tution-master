import { Skeleton } from '@/components/ui/skeleton';

export default function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 bg-gray-200" /> {/* title */}
          <Skeleton className="h-8 w-32 mt-3 bg-gray-300" /> {/* value */}
          <Skeleton className="h-4 w-20 mt-2 bg-gray-200" /> {/* change */}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Skeleton className="h-6 w-6 rounded-full bg-blue-100" /> {/* icon */}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type RecentPaymentsSkeletonProps = {
  title: string;
  limit: number;
};
export default function RecentPaymentsSkeleton({ title, limit }: RecentPaymentsSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(limit)].map((_, index) => (
          <Card key={index} className="bg-muted">
            <CardContent className="p-3 flex items-center justify-between animate-pulse">
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-300 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
              <div className="text-right space-y-1">
                <div className="h-4 w-16 bg-gray-300 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type RecentStudentsSkeletonProps = {
  title: string;
  limit: number;
};
export default function RecentStudentsSkeleton({ title, limit }: RecentStudentsSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(limit)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-3 animate-pulse flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 rounded" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-12 bg-gray-300 rounded" />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

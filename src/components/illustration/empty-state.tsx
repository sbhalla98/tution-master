'use client';

import { cn } from '@/lib/utils';
import { FileX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'Nothing to show',
  description = 'There is no data available right now.',
  icon = <FileX className="h-10 w-10 text-muted-foreground" />,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-2xl shadow-sm',
        className
      )}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

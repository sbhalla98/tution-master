'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShieldAlert } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  onReload?: () => void;
  buttonText?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'There seems to be some issue, please reload after some time.',
  icon = <ShieldAlert className="h-10 w-10 text-muted-foreground" />,
  className,
  onReload,
  buttonText = 'Reload',
}: ErrorStateProps) {
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
      {onReload && (
        <Button onClick={onReload} className="mt-4">
          {buttonText}
        </Button>
      )}
    </div>
  );
}

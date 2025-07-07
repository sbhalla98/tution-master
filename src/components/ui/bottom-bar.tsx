import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BottomBarProps {
  children: ReactNode;
  className?: string;
  position?: 'fixed' | 'sticky';
}

export function BottomBar({ children, className, position = 'sticky' }: BottomBarProps) {
  return (
    <div
      className={cn(
        'w-full border-t bg-white p-4 flex justify-end gap-2 z-50',
        position === 'fixed' && 'fixed bottom-0 left-0',
        position === 'sticky' && 'sticky bottom-0',
        className
      )}
    >
      {children}
    </div>
  );
}

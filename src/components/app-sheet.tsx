// components/shared/responsive-modal.tsx

'use client';

import { DrawerDescription } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

type AppSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  containerClassName?: string;
};

export function AppSheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  containerClassName,
}: AppSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-md sm:rounded-lg">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">{title}</SheetTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </SheetHeader>
        <div className={cn('flex-1 overflow-y-auto py-4 px-1 sm:px-2 min-h-0', containerClassName)}>
          {children}
        </div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}

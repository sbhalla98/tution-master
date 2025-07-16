'use client';

import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import AppBottomBar from './app-bottom-bar';
import AppSidebar from './app-sidebar';
import { SidebarProvider } from './ui/sidebar';
import { Toaster } from './ui/toaster';

type AppLayoutProps = {
  children: React.ReactNode;
};

const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      // 5 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [queryClient] = useState(() => new QueryClient(QUERY_CLIENT_CONFIG));
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <AppSidebar />
        <main className="p-6 w-full pb-20">{children}</main>
        <AppBottomBar />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

export const ROUTES = {
  DASHBOARD: '/dashboard',
  PAYMENTS: '/payments',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  STUDENTS: '/students',
} as const;

// [TODO] - Fix the icons
export const NAVIGATION_ITEMS = [
  {
    icon: Home,
    title: 'Dashboard',
    url: ROUTES.DASHBOARD,
  },
  {
    icon: Inbox,
    title: 'Students',
    url: ROUTES.STUDENTS,
  },
  {
    icon: Calendar,
    title: 'Payments',
    url: ROUTES.PAYMENTS,
  },
  {
    icon: Search,
    title: 'Reports',
    url: ROUTES.REPORTS,
  },
  {
    icon: Settings,
    title: 'Settings',
    url: ROUTES.SETTINGS,
  },
] as const;

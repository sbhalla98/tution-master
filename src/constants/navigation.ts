import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

export const ROUTES = {
  DASHBOARD: '/dashboard',
  STUDENTS: '/students',
  PAYMENTS: '/payments',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

// [TODO] - Fix the icons
export const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    url: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: 'Students',
    url: ROUTES.STUDENTS,
    icon: Inbox,
  },
  {
    title: 'Payments',
    url: ROUTES.PAYMENTS,
    icon: Calendar,
  },
  {
    title: 'Reports',
    url: ROUTES.REPORTS,
    icon: Search,
  },
  {
    title: 'Settings',
    url: ROUTES.SETTINGS,
    icon: Settings,
  },
] as const;

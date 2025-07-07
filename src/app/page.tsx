// app/page.tsx
import { ROUTES } from '@/constants/navigation';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect(ROUTES.DASHBOARD);
}

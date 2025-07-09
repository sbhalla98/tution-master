import Header from '@/components/header';
import { useTranslations } from 'next-intl';

export default function DashboardHeader() {
  const t = useTranslations('dashboard');

  return <Header title={t('title')} description={t('subtitle')} />;
}

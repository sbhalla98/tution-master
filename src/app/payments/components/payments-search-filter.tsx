'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAYMENT_STATUS_FILTER } from '@/constants/payments';
import { PaymentStatusFilterType } from '@/types/payments';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filter: PaymentStatusFilterType;
  onFilterChange: (val: PaymentStatusFilterType) => void;
};

export default function PaymentSearchFilter({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}: Props) {
  const t = useTranslations('payments.filter');

  const FILTER_OPTIONS: { label: string; value: PaymentStatusFilterType }[] = [
    { label: t('option.all'), value: PAYMENT_STATUS_FILTER.ALL },
    { label: t('option.paid'), value: PAYMENT_STATUS_FILTER.PAID },
    { label: t('option.pending'), value: PAYMENT_STATUS_FILTER.PENDING },
    { label: t('option.overdue'), value: PAYMENT_STATUS_FILTER.OVERDUE },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        {FILTER_OPTIONS.map(({ label, value }) => (
          <Button
            key={value}
            variant={filter === value ? 'default' : 'outline'}
            onClick={() => onFilterChange(value)}
            size="sm"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

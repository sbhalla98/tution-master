'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { STUDENT_STATUS_FILTER } from '@/constants/students';
import { StudentStatusFilterType } from '@/types/students';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filter: StudentStatusFilterType;
  onFilterChange: (val: StudentStatusFilterType) => void;
};

export default function StudentsSearchFilter({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}: Props) {
  const t = useTranslations('students.filter');

  const FILTER_OPTIONS: { label: string; value: StudentStatusFilterType }[] = [
    { label: t('options.all'), value: STUDENT_STATUS_FILTER.ALL },
    { label: t('options.active'), value: STUDENT_STATUS_FILTER.ACTIVE },
    { label: t('options.inactive'), value: STUDENT_STATUS_FILTER.INACTIVE },
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

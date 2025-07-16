'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAYMENT_STATUS_FILTER } from '@/constants/payments';
import { PaymentStatusFilterType } from '@/types/payments';
import { Search } from 'lucide-react';
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
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={filter === PAYMENT_STATUS_FILTER.ALL ? 'default' : 'outline'}
          onClick={() => onFilterChange(PAYMENT_STATUS_FILTER.ALL)}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === PAYMENT_STATUS_FILTER.PAID ? 'default' : 'outline'}
          onClick={() => onFilterChange(PAYMENT_STATUS_FILTER.PAID)}
          size="sm"
        >
          Paid
        </Button>
        <Button
          variant={filter === PAYMENT_STATUS_FILTER.PENDING ? 'default' : 'outline'}
          onClick={() => onFilterChange(PAYMENT_STATUS_FILTER.PENDING)}
          size="sm"
        >
          Pending
        </Button>
        <Button
          variant={filter === PAYMENT_STATUS_FILTER.OVERDUE ? 'default' : 'outline'}
          onClick={() => onFilterChange(PAYMENT_STATUS_FILTER.OVERDUE)}
          size="sm"
        >
          Overdue
        </Button>
      </div>
    </div>
  );
}

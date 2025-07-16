import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { STUDENT_STATUS_FILTER } from '@/constants/students';
import { StudentStatusFilterType } from '@/types/students';
import { Search } from 'lucide-react';

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
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={filter === STUDENT_STATUS_FILTER.ALL ? 'default' : 'outline'}
          onClick={() => onFilterChange(STUDENT_STATUS_FILTER.ALL)}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === STUDENT_STATUS_FILTER.ACTIVE ? 'default' : 'outline'}
          onClick={() => onFilterChange(STUDENT_STATUS_FILTER.ACTIVE)}
          size="sm"
        >
          Active
        </Button>
        <Button
          variant={filter === STUDENT_STATUS_FILTER.INACTIVE ? 'default' : 'outline'}
          onClick={() => onFilterChange(STUDENT_STATUS_FILTER.INACTIVE)}
          size="sm"
        >
          Inactive
        </Button>
      </div>
    </div>
  );
}

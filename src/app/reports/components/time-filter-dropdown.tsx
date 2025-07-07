import { TimeFilter } from '../types';

const TIME_FILTER_OPTIONS: { label: string; value: TimeFilter }[] = [
  { label: 'Current Month', value: 'current_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Current Year', value: 'current_year' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'All Time', value: 'all_time' },
];

type Props = {
  value: TimeFilter;
  onChange: (val: TimeFilter) => void;
};

export default function TimeFilterDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TimeFilter)}
      className="border border-gray-300 rounded-md px-4 py-2 text-sm"
    >
      {TIME_FILTER_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

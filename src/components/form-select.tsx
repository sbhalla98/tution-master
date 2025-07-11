import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormSelectOption {
  label: string;
  value: string;
}

type FormSelectProps = {
  name: string;
  label: string;
  options: Array<string | FormSelectOption>;
  placeholder?: string;
  control: any;
};

export default function FormSelect({
  name,
  label,
  options,
  placeholder,
  control,
}: FormSelectProps) {
  const normalizedOptions: FormSelectOption[] = options.map((opt) =>
    typeof opt === 'string'
      ? {
          label: opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase(),
          value: opt,
        }
      : opt
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {normalizedOptions.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

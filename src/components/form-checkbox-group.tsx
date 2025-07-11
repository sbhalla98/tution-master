import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface FormCheckboxGroupProps<T extends string> {
  name: string;
  label: string;
  options: T[];
  selected?: T[] | null;
  onChange: (option: T, checked: boolean) => void;
  control: any;
}

export function FormCheckboxGroup<T extends string>({
  name,
  label,
  options,
  selected,
  onChange,
  control,
}: FormCheckboxGroupProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            {options.map((option) => (
              <FormItem key={option} className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id={option}
                    checked={selected?.includes(option)}
                    onCheckedChange={(checked) => onChange(option, checked as boolean)}
                  />
                </FormControl>
                <FormLabel htmlFor={option} className="text-sm font-normal">
                  {option}
                </FormLabel>
              </FormItem>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

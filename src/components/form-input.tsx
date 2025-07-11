import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';

interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  control: any;
  className?: string;
}

export default function FormInput({
  name,
  label,
  placeholder,
  type = 'text',
  control,
  className,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === 'textarea' ? (
              <Textarea {...field} placeholder={placeholder} className={className} />
            ) : (
              <Input {...field} type={type} placeholder={placeholder} className={className} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

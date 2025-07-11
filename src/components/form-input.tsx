import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';

interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  control: any;
  textarea?: boolean;
}

export default function FormInput({
  name,
  label,
  placeholder,
  type = 'text',
  control,
  textarea = false,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {textarea ? (
              <Textarea {...field} placeholder={placeholder} />
            ) : (
              <Input {...field} type={type} placeholder={placeholder} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

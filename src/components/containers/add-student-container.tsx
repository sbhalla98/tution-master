import AddStudentForm from '@/components/forms/add-student-form';
import { useToast } from '@/hooks/use-toast';
import { createStudent } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type AddStudentContainerProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function AddStudentContainer({ isOpen, onClose }: AddStudentContainerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('students.add');

  const { mutate: createStudentMutation } = useMutation({
    mutationFn: createStudent,
    onError: () => {
      toast({
        description: t('error.description'),
        title: t('error.title'),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        description: t('success.description'),
        title: t('success.title'),
      });
      onClose();
    },
  });

  return <AddStudentForm isOpen={isOpen} onClose={onClose} onAddStudent={createStudentMutation} />;
}

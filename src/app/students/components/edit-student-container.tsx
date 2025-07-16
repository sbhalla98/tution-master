import EditStudentForm from '@/components/forms/edit-student-form';
import { useToast } from '@/hooks/use-toast';
import { updateStudent } from '@/lib/api';
import { Student } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type EditStudentContainerProps = {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
};
export default function EditStudentContainer({
  isOpen,
  onClose,
  student,
}: EditStudentContainerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('students.edit');

  const { mutate: updateStudentMutation } = useMutation({
    mutationFn: updateStudent,
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

  return (
    <EditStudentForm
      isOpen={isOpen}
      onClose={onClose}
      onUpdateStudent={updateStudentMutation}
      student={student}
    />
  );
}

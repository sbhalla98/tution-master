'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormCheckboxGroup } from './form-checkbox-group';
import FormInput from './form-input';
import FormSelect from './form-select';

import { AVAILABLE_GRADES, AVAILABLE_SUBJECTS, STUDENT_STATUS } from '@/constants';
import { CreateStudentFormData, createStudentSchema } from '@/schemas/student.schema';
import { Student, StudentSubjectType } from '@/types';
import { UpdateStudentRequest } from '@/types/api';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type EditStudentFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudent: (request: UpdateStudentRequest) => void;
  student: Student | null;
};

export default function EditStudentForm({
  isOpen,
  onClose,
  onUpdateStudent,
  student,
}: EditStudentFormProps) {
  const t = useTranslations('editStudentForm');

  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      subjects: [],
      status: STUDENT_STATUS.ACTIVE,
    },
  });

  const subjects = form.watch('subjects');

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        email: student.email,
        phone: student.phone,
        grade: student.grade,
        monthlyFee: student.monthlyFee,
        subjects: student.subjects,
        status: student.status,
      });
    }
  }, [student, form.reset]);

  const handleSubjectChange = (subject: StudentSubjectType, checked: boolean) => {
    const current = subjects || [];
    const updated = checked ? [...current, subject] : current.filter((s) => s !== subject);
    form.setValue('subjects', updated, { shouldValidate: true });
  };

  const onSubmit = (data: CreateStudentFormData) => {
    if (!student) return;

    const updatedStudent: UpdateStudentRequest = {
      id: student.id,
      payload: {
        ...data,
        name: data.name.trim(),
        monthlyFee: Number(data.monthlyFee),
      },
    };

    onUpdateStudent(updatedStudent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label={t('name.label')}
              placeholder={t('name.placeholder')}
              control={form.control}
            />
            <FormInput
              name="email"
              label={t('email.label')}
              placeholder={t('email.placeholder')}
              type="email"
              control={form.control}
            />
            <FormInput
              name="phone"
              label={t('phone.label')}
              placeholder={t('phone.placeholder')}
              control={form.control}
            />
            <FormCheckboxGroup
              name="subjects"
              label={t('subjects.label')}
              options={Object.values(AVAILABLE_SUBJECTS)}
              selected={subjects}
              onChange={handleSubjectChange}
              control={form.control}
            />
            <FormSelect
              name="grade"
              label={t('grade.label')}
              options={Object.values(AVAILABLE_GRADES)}
              control={form.control}
            />
            <FormInput
              name="monthlyFee"
              label={t('monthlyFee.label')}
              placeholder={t('monthlyFee.placeholder')}
              type="number"
              control={form.control}
            />
            <FormSelect
              name="status"
              label={t('status.label')}
              options={Object.values(STUDENT_STATUS)}
              control={form.control}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button type="submit">{t('update')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

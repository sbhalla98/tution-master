'use client';

import { FormCheckboxGroup } from '@/components/form-checkbox-group';
import FormInput from '@/components/form-input';
import FormSelect from '@/components/form-select';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { AVAILABLE_GRADES, AVAILABLE_SUBJECTS, STUDENT_STATUS } from '@/constants';
import { CreateStudentFormData, createStudentSchema } from '@/schemas/student.schema';
import { Student, StudentSubjectType } from '@/types';
import { UpdateStudentRequest } from '@/types/api';

import { AppSheet } from '@/components/app-sheet';
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
    defaultValues: {
      status: STUDENT_STATUS.ACTIVE,
      subjects: [],
    },
    resolver: zodResolver(createStudentSchema),
  });

  const subjects = form.watch('subjects');

  useEffect(() => {
    if (student) {
      form.reset({
        email: student.email,
        grade: student.grade,
        monthlyFee: student.monthlyFee,
        name: student.name,
        phone: student.phone,
        status: student.status,
        subjects: student.subjects,
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
        monthlyFee: Number(data.monthlyFee),
        name: data.name.trim(),
      },
    };

    onUpdateStudent(updatedStudent);
    onClose();
  };

  return (
    <AppSheet
      open={isOpen}
      onOpenChange={onClose}
      title={t('title')}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {t('update')}
          </Button>
        </>
      }
    >
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
        </form>
      </Form>
    </AppSheet>
  );
}

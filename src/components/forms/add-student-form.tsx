'use client';

import { Form } from '@/components/ui/form';

import { AVAILABLE_GRADES, AVAILABLE_SUBJECTS, STUDENT_STATUS } from '@/constants';
import { CreateStudentFormData, createStudentSchema } from '@/schemas/student.schema';
import { StudentSubjectType } from '@/types';
import { CreateStudentRequest } from '@/types/api';

import { AppSheet } from '@/components/app-sheet';
import { FormCheckboxGroup } from '@/components/form-checkbox-group';
import FormInput from '@/components/form-input';
import FormSelect from '@/components/form-select';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

interface AddStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: CreateStudentRequest) => void;
}

export default function AddStudentForm({ isOpen, onClose, onAddStudent }: AddStudentFormProps) {
  const t = useTranslations('studentForm');
  const form = useForm<CreateStudentFormData>({
    defaultValues: {
      status: STUDENT_STATUS.ACTIVE,
      subjects: [],
    },
    resolver: zodResolver(createStudentSchema),
  });

  const subjects = form.watch('subjects');

  const handleSubjectChange = (subject: StudentSubjectType, checked: boolean) => {
    const current = subjects || [];
    const updated = checked ? [...current, subject] : current.filter((s) => s !== subject);
    form.setValue('subjects', updated, { shouldValidate: true });
  };

  const onSubmit = (data: CreateStudentFormData) => {
    const newStudent: CreateStudentRequest = {
      ...data,
      joinDate: Date.now(),
      monthlyFee: Number(data.monthlyFee),
      name: data.name.trim(),
    };

    onAddStudent(newStudent);
    form.reset();
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
            {t('submit')}
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

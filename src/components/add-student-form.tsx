'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { AVAILABLE_GRADES, AVAILABLE_SUBJECTS, STUDENT_STATUS } from '@/constants';
import { CreateStudentFormData, createStudentSchema } from '@/schemas/student.schema';
import { StudentSubjectType } from '@/types';
import { CreateStudentRequest } from '@/types/api';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormCheckboxGroup } from './form-checkbox-group';
import FormInput from './form-input';
import FormSelect from './form-select';

interface AddStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: CreateStudentRequest) => void;
}

export default function AddStudentForm({ isOpen, onClose, onAddStudent }: AddStudentFormProps) {
  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      subjects: [],
      status: STUDENT_STATUS.ACTIVE,
    },
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
      name: data.name.trim(),
      monthlyFee: Number(data.monthlyFee),
      joinDate: Date.now(),
    };

    onAddStudent(newStudent);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Full Name"
              placeholder="Enter student's full name"
              control={form.control}
            />
            <FormInput
              name="email"
              label="Email"
              placeholder="Enter email"
              type="email"
              control={form.control}
            />
            <FormInput
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
              control={form.control}
            />
            <FormCheckboxGroup
              name="subjects"
              label="Subjects"
              options={Object.values(AVAILABLE_SUBJECTS)}
              selected={subjects}
              onChange={handleSubjectChange}
              control={form.control}
            />
            <FormSelect
              name="grade"
              label="Grade"
              options={Object.values(AVAILABLE_GRADES)}
              control={form.control}
            />
            <FormInput
              name="monthlyFee"
              label="Monthly Fee (₹)"
              placeholder="Enter monthly fee"
              type="number"
              control={form.control}
            />
            <FormSelect
              name="status"
              label="Status"
              options={Object.values(STUDENT_STATUS)}
              control={form.control}
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Student</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

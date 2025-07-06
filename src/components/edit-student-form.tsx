'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { AVAILABLE_GRADES, AVAILABLE_SUBJECTS, STUDENT_STATUS } from '@/constants';
import { CreateStudentFormData, createStudentSchema } from '@/schemas/student.schema';
import { Student, StudentGradeType, StudentStatusType, StudentSubjectType } from '@/types';
import { UpdateStudentRequest } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudent: (request: UpdateStudentRequest) => void;
  student: Student | null;
}

export default function EditStudentForm({
  isOpen,
  onClose,
  onUpdateStudent,
  student,
}: EditStudentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      subjects: [],
      status: STUDENT_STATUS.ACTIVE,
    },
  });

  const subjects = watch('subjects');
  const status = watch('status');
  const grade = watch('grade');

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        phone: student.phone,
        grade: student.grade,
        monthlyFee: student.monthlyFee,
        subjects: student.subjects,
        status: student.status,
      });
    }
  }, [student, reset]);

  const handleSubjectChange = (subject: StudentSubjectType, checked: boolean) => {
    const current = subjects ?? [];
    const updated = checked ? [...current, subject] : current.filter((s) => s !== subject);
    setValue('subjects', updated, { shouldValidate: true });
  };

  const onSubmit = (data: CreateStudentFormData) => {
    if (!student) return;

    const payload: UpdateStudentRequest['payload'] = {
      ...data,
      monthlyFee: Number(data.monthlyFee),
    };

    onUpdateStudent({ id: student.id, payload });
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} placeholder="Enter student's full name" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="Enter email" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} placeholder="Enter phone number" />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Subjects */}
          <div className="space-y-2">
            <Label>Subjects</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(AVAILABLE_SUBJECTS).map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={subjects?.includes(subject)}
                    onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                  />
                  <Label htmlFor={subject} className="text-sm">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
            {errors.subjects && <p className="text-sm text-red-500">{errors.subjects.message}</p>}
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select
              value={grade || ''}
              onValueChange={(value: StudentGradeType) =>
                setValue('grade', value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AVAILABLE_GRADES).map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.grade && <p className="text-sm text-red-500">{errors.grade.message}</p>}
          </div>

          {/* Monthly Fee */}
          <div className="space-y-2">
            <Label htmlFor="monthlyFee">Monthly Fee (₹)</Label>
            <Input
              id="monthlyFee"
              type="number"
              {...register('monthlyFee')}
              placeholder="Enter monthly fee"
            />
            {errors.monthlyFee && (
              <p className="text-sm text-red-500">{errors.monthlyFee.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: StudentStatusType) =>
                setValue('status', value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(STUDENT_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Student</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

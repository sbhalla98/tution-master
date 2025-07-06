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
import { useEffect, useState } from 'react';
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
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
  });

  const [selectedSubjects, setSelectedSubjects] = useState<StudentSubjectType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StudentStatusType>(STUDENT_STATUS.ACTIVE);

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        phone: student.phone,
        grade: student.grade,
        monthlyFee: student.monthlyFee,
      });
      setSelectedSubjects(student.subjects || []);
      setSelectedStatus(student.status);
    }
  }, [student, reset]);

  const handleSubjectChange = (subject: StudentSubjectType, checked: boolean) => {
    setSelectedSubjects((prev) =>
      checked ? [...prev, subject] : prev.filter((s) => s !== subject)
    );
  };

  const onSubmit = (data: CreateStudentFormData) => {
    if (!student) return;

    const payload: UpdateStudentRequest['payload'] = {
      ...data,
      monthlyFee: Number(data.monthlyFee),
      subjects: selectedSubjects,
      status: selectedStatus,
    };

    onUpdateStudent({ id: student.id, payload });
    reset();
    setSelectedSubjects([]);
    setSelectedStatus(STUDENT_STATUS.ACTIVE);
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
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={(checked: boolean) => handleSubjectChange(subject, checked)}
                  />
                  <Label htmlFor={subject} className="text-sm">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select onValueChange={(value: StudentGradeType) => setValue('grade', value)}>
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
              value={selectedStatus}
              onValueChange={(value: StudentStatusType) => setSelectedStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(STUDENT_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

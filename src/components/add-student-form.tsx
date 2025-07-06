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
import { StudentGradeType, StudentStatusType, StudentSubjectType } from '@/types';
import { CreateStudentRequest } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: CreateStudentRequest) => void;
}

export default function AddStudentForm({ isOpen, onClose, onAddStudent }: AddStudentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
  });

  const [selectedSubjects, setSelectedSubjects] = useState<StudentSubjectType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StudentStatusType>(STUDENT_STATUS.ACTIVE);

  const handleSubjectChange = (subject: StudentSubjectType, checked: boolean) => {
    if (checked) {
      setSelectedSubjects((prev) => [...prev, subject]);
    } else {
      setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
    }
  };

  const onSubmit = (data: CreateStudentFormData) => {
    const newStudent: CreateStudentRequest = {
      ...data,
      name: data.name.trim(),
      monthlyFee: Number(data.monthlyFee),
      joinDate: Date.now(),
      status: selectedStatus,
      subjects: selectedSubjects,
    };

    onAddStudent(newStudent);
    reset();
    setSelectedSubjects([]);
    setSelectedStatus(STUDENT_STATUS.ACTIVE);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} placeholder="Enter student's full name" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="Enter email" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} placeholder="Enter phone number" />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select onValueChange={(value: StudentGradeType) => setValue('grade', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(AVAILABLE_GRADES).map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.grade && <p className="text-sm text-red-500">{errors.grade.message}</p>}
          </div>

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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

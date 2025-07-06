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
import { STUDENT_STATUS } from '@/constants';
import { Student, StudentStatusType } from '@/types/student';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface EditStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudent: (student: Student) => void;
  student: Student | null;
}

const availableSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];

export default function EditStudentForm({
  isOpen,
  onClose,
  onUpdateStudent,
  student,
}: EditStudentFormProps) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StudentStatusType>(STUDENT_STATUS.ACTIVE);

  useEffect(() => {
    if (student) {
      setValue('name', student.name);
      setValue('email', student.email);
      setValue('phone', student.phone);
      setValue('grade', student.grade);
      setValue('monthlyFee', student.monthlyFee);
      setSelectedSubjects(student.subjects);
      setSelectedStatus(student.status);
    }
  }, [student, setValue]);

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects((prev) => [...prev, subject]);
    } else {
      setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
    }
  };

  const onSubmit = (data: any) => {
    if (!student) return;

    const updatedStudent: Student = {
      ...student,
      email: data.email,
      grade: data.grade,
      monthlyFee: Number(data.monthlyFee),
      name: data.name,
      phone: data.phone,
      status: selectedStatus,
      subjects: selectedSubjects,
    };

    onUpdateStudent(updatedStudent);
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
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name', { required: true })}
              placeholder="Enter student's full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: true })}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone', { required: true })}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label>Subjects</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableSubjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
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
            <Input
              id="grade"
              {...register('grade', { required: true })}
              placeholder="Enter grade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyFee">Monthly Fee (₹)</Label>
            <Input
              id="monthlyFee"
              type="number"
              {...register('monthlyFee', { min: 0, required: true })}
              placeholder="Enter monthly fee"
            />
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

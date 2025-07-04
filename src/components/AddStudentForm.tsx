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
import { Student } from '@/types/student';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

const availableSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];

export default function AddStudentForm({ isOpen, onClose, onAddStudent }: AddStudentFormProps) {
  const { register, handleSubmit, reset } = useForm();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive'>('active');

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects((prev) => [...prev, subject]);
    } else {
      setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
    }
  };

  const onSubmit = (data: any) => {
    const newStudent: Omit<Student, 'id'> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subjects: selectedSubjects, // Changed from subject to subjects
      grade: data.grade,
      monthlyFee: Number(data.monthlyFee),
      joinDate: new Date().toISOString().split('T')[0],
      status: selectedStatus,
    };

    onAddStudent(newStudent);
    reset();
    setSelectedSubjects([]);
    setSelectedStatus('active');
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
            <Select onValueChange={(value) => register('grade').onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Grade 6</SelectItem>
                <SelectItem value="7">Grade 7</SelectItem>
                <SelectItem value="8">Grade 8</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
                <SelectItem value="12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyFee">Monthly Fee (₹)</Label>
            <Input
              id="monthlyFee"
              type="number"
              {...register('monthlyFee', { required: true, min: 0 })}
              placeholder="Enter monthly fee"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value: 'active' | 'inactive') => setSelectedStatus(value)}
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
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

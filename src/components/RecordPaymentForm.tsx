import { Button } from '@/components/ui/button';
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
import { Payment } from '@/types/student';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface RecordPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (payment: Omit<Payment, 'id'>) => void;
  students: Array<{ id: string; name: string; monthlyFee: number }>;
}

export default function RecordPaymentForm({
  isOpen,
  onClose,
  onRecordPayment,
  students,
}: RecordPaymentFormProps) {
  const { register, handleSubmit, reset } = useForm();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('paid');

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const selectedStudentData = students.find((s) => s.id === selectedStudent);

  const onSubmit = (data: any) => {
    if (!selectedStudentData) return;

    const newPayment: Omit<Payment, 'id'> = {
      amount: Number(data.amount),
      dueDate: data.dueDate,
      month: selectedMonth,
      paymentDate: selectedStatus === 'paid' ? new Date().toISOString() : undefined,
      status: selectedStatus as 'paid' | 'pending' | 'overdue',
      studentId: selectedStudent,
      studentName: selectedStudentData.name,
      year: Number(data.year),
    };

    onRecordPayment(newPayment);
    reset();
    setSelectedStudent('');
    setSelectedMonth('');
    setSelectedStatus('paid');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              {...register('year', { required: true })}
              defaultValue={new Date().getFullYear()}
              placeholder="Enter year"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              {...register('amount', { min: 0, required: true })}
              defaultValue={selectedStudentData?.monthlyFee || ''}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register('dueDate', { required: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Record Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

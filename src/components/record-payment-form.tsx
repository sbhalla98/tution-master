'use client';

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
import { PAYMENT_STATUS } from '@/constants';
import { RecordPaymentFormData, recordPaymentSchema } from '@/schemas/payment.schema';
import { CreatePaymentRequest } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface RecordPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (payment: CreatePaymentRequest) => void;
  students: Array<{ id: string; name: string; monthlyFee: number }>;
}

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

export default function RecordPaymentForm({
  isOpen,
  onClose,
  onRecordPayment,
  students,
}: RecordPaymentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecordPaymentFormData>({
    defaultValues: {
      status: PAYMENT_STATUS.PAID,
      year: new Date().getFullYear(),
    },
    resolver: zodResolver(recordPaymentSchema),
  });

  const selectedStudentId = watch('studentId');
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const onSubmit = (data: RecordPaymentFormData) => {
    const newPayment: CreatePaymentRequest = {
      amount: Number(data.amount),
      dueDate: data.dueDate,
      month: data.month,
      paymentDate: data.status === PAYMENT_STATUS.PAID ? new Date().toISOString() : undefined,
      status: data.status,
      studentId: data.studentId,
      studentName: selectedStudent?.name || '',
      year: Number(data.year),
    };

    onRecordPayment(newPayment);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Student */}
          <div className="space-y-2">
            <Label htmlFor="studentId">Student</Label>
            <Select onValueChange={(val) => setValue('studentId', val)}>
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
            {errors.studentId && <p className="text-sm text-red-500">{errors.studentId.message}</p>}
          </div>

          {/* Month */}
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select onValueChange={(val) => setValue('month', val)}>
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
            {errors.month && <p className="text-sm text-red-500">{errors.month.message}</p>}
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" {...register('year')} />
            {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              {...register('amount')}
              defaultValue={selectedStudent?.monthlyFee || ''}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
            {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(val) => setValue('status', val as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PAYMENT_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
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

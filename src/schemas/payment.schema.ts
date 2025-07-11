import { PAYMENT_STATUS } from '@/constants';
import { z } from 'zod';

export const recordPaymentSchema = z.object({
  amount: z.coerce.number().min(0, 'Amount must be at least ₹0'),
  dueDate: z.string().min(1, 'Due date is required'),
  month: z.string().min(1, 'Month is required'),
  status: z.enum([PAYMENT_STATUS.PAID, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.OVERDUE]),
  studentId: z.string().min(1, 'Student is required'),
  year: z.coerce.number().min(2020, 'Enter valid year'),
});

export type RecordPaymentFormData = z.infer<typeof recordPaymentSchema>;

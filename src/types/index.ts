import { PAYMENT_STATUS, STUDENT_STATUS } from '@/constants';

export type StudentStatusType = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[]; // Changed from subject to subjects array
  grade: string;
  monthlyFee: number;
  joinDate: string;
  status: StudentStatusType;
};

export type PaymentStatusType = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type Payment = {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  year: number;
  amount: number;
  status: PaymentStatusType;
  paymentDate?: string;
  dueDate: string;
};

import { PAYMENT_STATUS, STUDENT_STATUS } from '@/constants';

export type StudentStatusType = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

export type Student = {
  userId: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  grade: string;
  monthlyFee: number;
  joinDate: string;
  status: StudentStatusType;
  createdAt: EpochTimeStamp;
  updatedAt: EpochTimeStamp;
  deletedAt: EpochTimeStamp | null;
  isDeleted: boolean;
};

export type PaymentStatusType = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type Payment = {
  userId: string;
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  year: number;
  amount: number;
  status: PaymentStatusType;
  paymentDate?: string;
  dueDate: string;
  createdAt: EpochTimeStamp;
  updatedAt: EpochTimeStamp;
  deletedAt: EpochTimeStamp | null;
  isDeleted: boolean;
};

import { AVAILABLE_GRADES, AVAILABLE_SUBJECTS, PAYMENT_STATUS, STUDENT_STATUS } from '@/constants';

export type StudentStatusType = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];
export type StudentSubjectType = (typeof AVAILABLE_SUBJECTS)[keyof typeof AVAILABLE_SUBJECTS];
export type StudentGradeType = (typeof AVAILABLE_GRADES)[keyof typeof AVAILABLE_GRADES];

export type Student = {
  userId: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects?: StudentSubjectType[] | null;
  grade?: StudentGradeType | null;
  monthlyFee: number;
  joinDate: EpochTimeStamp;
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

export type User = {
  id: string;
  fistName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  // role?: 'admin' | 'user';
  createdAt: EpochTimeStamp;
  updatedAt: EpochTimeStamp;
  deletedAt: EpochTimeStamp | null;
  isDeleted: boolean;
};

export type SETTINGS = {
  userId: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessLogo?: string | null;
  subjects?: StudentSubjectType[] | null;
  createdAt: EpochTimeStamp;
  updatedAt: EpochTimeStamp;
};

// types/api.ts

import { Payment, PaymentStatusType, Student } from './index';

// ---------- Student APIs ----------

// Request to get all students
export type GetStudentsResponse = Student[] | null | undefined;

// Request to get a specific student by ID
export type GetStudentRequest = {
  id: string;
};
export type GetStudentResponse = Student[] | null | undefined;

// Request to create a new student
export type CreateStudentRequest = Omit<
  Student,
  'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
>;
export type CreateStudentResponse = Student | null | undefined;

// Request to update an existing student
export type UpdateStudentRequest = {
  id: string;
  updatePayload: Partial<
    Omit<Student, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>
  >;
};
export type UpdateStudentResponse = Student | null | undefined;

// Request to delete an existing student
export type DeleteStudentRequest = {
  id: string;
};
export type DeleteStudentResponse = Student | null | undefined;

// ---------- Payment APIs ----------

// Request to get all payments
export type GetPaymentsResponse = Payment[] | null | undefined;

// Request to get payments for a specific student
export type GetStudentPaymentsRequest = {
  studentId: string;
};
export type GetStudentPaymentsResponse = Payment[] | null | undefined;

// Request to create a new payment
export type CreatePaymentRequest = Omit<
  Payment,
  'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
>;
export type CreatePaymentResponse = Payment | null | undefined;

// Request to update a new payment
export type UpdatePaymentRequest = {
  id: string;
  updatePayload: Partial<
    Omit<Payment, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>
  >;
};
export type UpdatePaymentResponse = Payment | null | undefined;

// Request to mark payment status
export type MarkPaymentStatusRequest = {
  id: string;
  status: PaymentStatusType;
};
export type MarkPaymentStatusResponse = Payment | null | undefined;

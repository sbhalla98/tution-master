// types/api.ts

import { Payment, PaymentStatusType, SETTINGS, Student, User } from './index';

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
  payload: Partial<
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
  payload: Partial<
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

// ---------- User APIs ----------

// Request to get user details
export type GetUserResponse = User | null | undefined;

// Request to create a user
export type CreateUserRequest = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
>;

export type CreateUserResponse = User | null | undefined;

// Request to update a user
export type UpdateUserRequest = Partial<
  Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>
>;

export type UpdateUserResponse = User | null | undefined;

// ---------- Setting APIs ----------

// Request to get settings details
export type GetSettingsResponse = SETTINGS | null | undefined;

// Request to update settings
export type UpdateSettingsRequest = Partial<Omit<SETTINGS, 'userId' | 'createdAt' | 'updatedAt'>>;

export type UpdateSettingsResponse = SETTINGS | null | undefined;

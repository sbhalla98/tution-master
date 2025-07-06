import { Payment, PaymentStatusType, Student } from '@/types';
import axios from './axios';

// students API calls
export async function getStudents() {
  return await axios.get('/api/students');
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
  return await axios.post('/api/student', student);
}

export async function getStudent(id: string): Promise<Student | null> {
  return await axios.get(`/api/student/${id}`);
}

export async function updateStudent(
  id: string,
  student: Partial<Omit<Student, 'id'>>
): Promise<Student | null> {
  return await axios.put(`/api/student/${id}`, student);
}

export async function deleteStudent(id: string): Promise<Student | null> {
  return await axios.delete(`/api/student/${id}`);
}

// payments API calls
export async function getPayments() {
  return await axios.get('/api/payments');
}

export async function getStudentPayments(studentId: string): Promise<Payment[]> {
  return await axios.get(`/api/payments/${studentId}`);
}

export async function createPayment(payment: Omit<Payment, 'id'>): Promise<Payment | null> {
  return await axios.post('/api/payment', payment);
}

export async function updatePayment(
  id: string,
  payment: Partial<Omit<Payment, 'id'>>
): Promise<Payment | null> {
  return await axios.put(`/api/payment/${id}`, payment);
}

export async function markPaymentStatus(
  id: string,
  status: PaymentStatusType
): Promise<Payment | null> {
  return await axios.put(`/api/payment/${id}`, { status });
}

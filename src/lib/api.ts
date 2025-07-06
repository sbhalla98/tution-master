import { Payment, PaymentStatusType, Student } from '@/types';
import axios from './axios';

// students API calls
export async function getStudents(): Promise<Student[] | null> {
  const res = await axios.get('/students');
  return res.data;
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
  const res = await axios.post('/student', student);
  return res.data;
}

export async function getStudent(id: string): Promise<Student | null> {
  const res = await axios.get(`/student/${id}`);
  return res.data;
}

export async function updateStudent({
  id,
  updatePayload,
}: {
  id: string;
  updatePayload: Partial<Omit<Student, 'id'>>;
}): Promise<Student | null> {
  const res = await axios.put(`/student/${id}`, updatePayload);
  return res.data;
}

export async function deleteStudent(id: string): Promise<Student | null> {
  const res = await axios.delete(`/student/${id}`);
  return res.data;
}

// payments API calls
export async function getPayments(): Promise<Payment[] | null> {
  const res = await axios.get('/payments');
  return res.data;
}

export async function getStudentPayments(studentId: string): Promise<Payment[]> {
  const res = await axios.get(`/payments/${studentId}`);
  return res.data;
}

export async function createPayment(payment: Omit<Payment, 'id'>): Promise<Payment | null> {
  const res = await axios.post('/payment', payment);
  return res.data;
}

export async function updatePayment(
  id: string,
  payment: Partial<Omit<Payment, 'id'>>
): Promise<Payment | null> {
  const res = await axios.put(`/payment/${id}`, payment);
  return res.data;
}

export async function markPaymentStatus({
  id,
  status,
}: {
  id: string;
  status: PaymentStatusType;
}): Promise<Payment | null> {
  const res = await axios.put(`/payment/${id}`, { status });
  return res.data;
}

import { Student } from '@/types/student';
import axios from './axios';

export async function getStudents() {
  return await axios.get('/api/students');
}

export async function getPayments() {
  return await axios.get('/api/payments');
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
  return await axios.post('/api/student', student);
}

export async function getStudent(id: string): Promise<Student | null> {
  return await axios.get(`/api/student/${id}`);
}

export async function updateStudent(
  id: string,
  student: Omit<Student, 'id'>
): Promise<Student | null> {
  return await axios.put(`/api/student/${id}`, student);
}

export async function deleteStudent(id: string): Promise<Student | null> {
  return await axios.delete(`/api/student/${id}`);
}

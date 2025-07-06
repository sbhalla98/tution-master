import { Student } from '@/types/student';
import axios from './axios';

export async function getStudents() {
  return await axios.get('/api/get-students');
}

export async function getPayments() {
  return await axios.get('/api/get-payments');
}

export async function getStudent(id: string): Promise<Student | null> {
  return await axios.get(`/api/get-student/${id}`);
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
  return await axios.post('/api/create-student', student);
}

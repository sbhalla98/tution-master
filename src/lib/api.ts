import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  CreateStudentRequest,
  CreateStudentResponse,
  DeleteStudentRequest,
  DeleteStudentResponse,
  GetPaymentsResponse,
  GetSettingsResponse,
  GetStudentPaymentsRequest,
  GetStudentPaymentsResponse,
  GetStudentRequest,
  GetStudentResponse,
  GetStudentsResponse,
  MarkPaymentStatusRequest,
  MarkPaymentStatusResponse,
  UpdatePaymentRequest,
  UpdatePaymentResponse,
  UpdateSettingsRequest,
  UpdateSettingsResponse,
  UpdateStudentRequest,
  UpdateStudentResponse,
} from '@/types/api';
import axios from './axios';

// ---------- Student APIs ----------

export async function getStudents(limit?: number): Promise<GetStudentsResponse> {
  const res = await axios.get(`/students${limit ? `?limit=${limit}` : ''}`);
  return res.data;
}

export async function getStudent(request: GetStudentRequest): Promise<GetStudentResponse> {
  const { id } = request;
  const res = await axios.get(`/student/${id}`);
  return res.data;
}

export async function createStudent(request: CreateStudentRequest): Promise<CreateStudentResponse> {
  const res = await axios.post('/student', request);
  return res.data;
}

export async function updateStudent(request: UpdateStudentRequest): Promise<UpdateStudentResponse> {
  const { id, payload } = request;
  const res = await axios.put(`/student/${id}`, payload);
  return res.data;
}

export async function deleteStudent(request: DeleteStudentRequest): Promise<DeleteStudentResponse> {
  const { id } = request;
  const res = await axios.delete(`/student/${id}`);
  return res.data;
}

// ---------- Payment APIs ----------

export async function getPayments(limit?: number): Promise<GetPaymentsResponse> {
  const res = await axios.get(`/payments${limit ? `?limit=${limit}` : ''}`);
  return res.data;
}

export async function getStudentPayments(
  request: GetStudentPaymentsRequest
): Promise<GetStudentPaymentsResponse> {
  const { studentId } = request;
  const res = await axios.get(`/payments/${studentId}`);
  return res.data;
}

export async function createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  const res = await axios.post('/payment', request);
  return res.data;
}

export async function updatePayment(request: UpdatePaymentRequest): Promise<UpdatePaymentResponse> {
  const { id, payload } = request;
  const res = await axios.put(`/payment/${id}`, payload);
  return res.data;
}

export async function markPaymentStatus(
  request: MarkPaymentStatusRequest
): Promise<MarkPaymentStatusResponse> {
  const { id, status } = request;
  const res = await axios.put(`/payment/${id}`, { status });
  return res.data;
}

// ---------- Settings APIs ----------

export async function getSettings(): Promise<GetSettingsResponse> {
  const res = await axios.get('/settings');
  return res.data;
}

export async function updateSettings(
  request: UpdateSettingsRequest
): Promise<UpdateSettingsResponse> {
  const res = await axios.put('/settings', request);
  return res.data;
}

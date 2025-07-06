import { mockPayments, mockStudents } from '@/data/mockData';
import { Payment, Student } from '@/types/student';

// API service layer - currently using mock data but structured for real API calls
class ApiService {
  private students: Student[] = [...mockStudents];
  private payments: Payment[] = [...mockPayments];

  async deleteStudent(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.students.splice(index, 1);
    return true;
  }

  async getStudentPayments(studentId: string): Promise<Payment[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.payments.filter((p) => p.studentId === studentId);
  }

  async createPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const newPayment: Payment = {
      ...paymentData,
      id: (this.payments.length + 1).toString(),
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  async updatePayment(id: string, paymentData: Partial<Payment>): Promise<Payment | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const index = this.payments.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.payments[index] = { ...this.payments[index], ...paymentData };
    return this.payments[index];
  }

  async markPaymentAsPaid(id: string): Promise<Payment | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const index = this.payments.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.payments[index] = {
      ...this.payments[index],
      paymentDate: new Date().toISOString(),
      status: 'paid' as const,
    };
    return this.payments[index];
  }

  // Get student details with phone number for WhatsApp reminders
  async getStudentForReminder(id: string): Promise<{ phone: string; name: string } | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const student = this.students.find((s) => s.id === id);
    if (!student) return null;

    return {
      name: student.name,
      phone: student.phone,
    };
  }
}

export const apiService = new ApiService();


export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[]; // Changed from subject to subjects array
  grade: string;
  monthlyFee: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  year: number;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  dueDate: string;
}

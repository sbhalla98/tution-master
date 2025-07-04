import { Student, Payment } from '@/types/student';

export const mockStudents: Student[] = [
  {
    email: 'alice.johnson@email.com',
    // Changed to array
    grade: '10',

    id: '1',

    joinDate: '2024-01-15',

    monthlyFee: 150,
    name: 'Alice Johnson',
    phone: '+1 (555) 123-4567',
    status: 'active',
    subjects: ['Mathematics', 'Physics'],
  },
  {
    email: 'bob.smith@email.com',
    // Changed to array
    grade: '11',

    id: '2',

    joinDate: '2024-02-01',

    monthlyFee: 175,
    name: 'Bob Smith',
    phone: '+1 (555) 234-5678',
    status: 'active',
    subjects: ['Physics', 'Chemistry'],
  },
  {
    email: 'carol.davis@email.com',
    // Changed to array
    grade: '12',

    id: '3',

    joinDate: '2024-01-20',

    monthlyFee: 160,
    name: 'Carol Davis',
    phone: '+1 (555) 345-6789',
    status: 'active',
    subjects: ['Chemistry', 'Biology'],
  },
  {
    email: 'david.wilson@email.com',
    // Changed to array
    grade: '9',

    id: '4',

    joinDate: '2024-03-10',

    monthlyFee: 140,
    name: 'David Wilson',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    subjects: ['Biology'],
  },
];

export const mockPayments: Payment[] = [
  {
    amount: 150,
    dueDate: '2024-01-31',
    id: '1',
    month: 'January',
    paymentDate: '2024-01-05',
    status: 'paid',
    studentId: '1',
    studentName: 'Alice Johnson',
    year: 2024,
  },
  {
    amount: 150,
    dueDate: '2024-02-29',
    id: '2',
    month: 'February',
    paymentDate: '2024-02-03',
    status: 'paid',
    studentId: '1',
    studentName: 'Alice Johnson',
    year: 2024,
  },
  {
    amount: 150,
    dueDate: '2024-03-31',
    id: '3',
    month: 'March',
    status: 'pending',
    studentId: '1',
    studentName: 'Alice Johnson',
    year: 2024,
  },
  {
    amount: 175,
    dueDate: '2024-02-29',
    id: '4',
    month: 'February',
    paymentDate: '2024-02-10',
    status: 'paid',
    studentId: '2',
    studentName: 'Bob Smith',
    year: 2024,
  },
  {
    amount: 175,
    dueDate: '2024-03-31',
    id: '5',
    month: 'March',
    status: 'overdue',
    studentId: '2',
    studentName: 'Bob Smith',
    year: 2024,
  },
  {
    amount: 160,
    dueDate: '2024-01-31',
    id: '6',
    month: 'January',
    paymentDate: '2024-01-15',
    status: 'paid',
    studentId: '3',
    studentName: 'Carol Davis',
    year: 2024,
  },
  {
    amount: 160,
    dueDate: '2024-02-29',
    id: '7',
    month: 'February',
    paymentDate: '2024-02-12',
    status: 'paid',
    studentId: '3',
    studentName: 'Carol Davis',
    year: 2024,
  },
  {
    amount: 160,
    dueDate: '2024-03-31',
    id: '8',
    month: 'March',
    status: 'pending',
    studentId: '3',
    studentName: 'Carol Davis',
    year: 2024,
  },
];

import { Student } from '@/types/student';
import { Mail, Phone, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onViewPayments: (studentId: string, studentName: string) => void;
}

export default function StudentCard({ student, onEdit, onViewPayments }: StudentCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              student.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {student.status}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">₹{student.monthlyFee}</p>
          <p className="text-sm text-gray-500">per month</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          {student.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          {student.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <BookOpen className="h-4 w-4 mr-2" />
          {student.subjects.join(', ')} - Grade {student.grade}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          Joined: {new Date(student.joinDate).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(student)} className="flex-1">
          Edit
        </Button>
        <Button
          size="sm"
          onClick={() => onViewPayments(student.id, student.name)}
          className="flex-1"
        >
          View Payments
        </Button>
      </div>
    </div>
  );
}

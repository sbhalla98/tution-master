'use client';
import AddStudentForm from '@/components/AddStudentForm';
import EditStudentForm from '@/components/EditStudentForm';
import StudentCard from '@/components/StudentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ViewPaymentsModal from '@/components/ViewPaymentsModal';
import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { createStudent, markPaymentStatus, updateStudent } from '@/lib/api';
import { Student } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { STUDENT_STATUS_FILTER } from '../constants';
import { StudentStatusFilterType } from '../types';

type StudentsContainerProps = {
  students?: Student[] | null;
};

export default function StudentsContainer({ students }: StudentsContainerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<StudentStatusFilterType>(STUDENT_STATUS_FILTER.ALL);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isViewPaymentsOpen, setIsViewPaymentsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createStudentMutation } = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        description: 'Student added successfully',
        title: 'Added new student',
      });
    },
    onError: () => {
      toast({
        description: 'Failed to add student. Please try again.',
        title: 'Error',
        variant: 'destructive',
      });
    },
  });

  const { mutate: updateStudentMutation } = useMutation({
    mutationFn: updateStudent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        description: 'Student updated successfully',
        title: 'Updated!!',
      });
    },
    onError: () => {
      toast({
        description: 'Failed to updated student. Please try again.',
        title: 'Error',
        variant: 'destructive',
      });
    },
  });

  const { mutate: markPaymentStatusMutation } = useMutation({
    mutationFn: markPaymentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: 'Payment marked as paid successfully',
        title: 'Payment Updated',
      });
    },
    onError: () => {
      toast({
        description: 'Failed to mark payment as paid. Please try again.',
        title: 'Error',
        variant: 'destructive',
      });
    },
  });

  const filteredStudents = (students ?? []).filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filter === STUDENT_STATUS_FILTER.ALL || student.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsEditStudentOpen(true);
  };

  const handleViewPayments = (studentId: string, studentName: string) => {
    setSelectedStudentId(studentId);
    setSelectedStudentName(studentName);
    setIsViewPaymentsOpen(true);
  };

  const handleMarkPaid = (paymentId: string) => {
    markPaymentStatusMutation({
      id: paymentId,
      status: PAYMENT_STATUS.PAID,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage your student records</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddStudentOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === STUDENT_STATUS_FILTER.ALL ? 'default' : 'outline'}
            onClick={() => setFilter(STUDENT_STATUS_FILTER.ALL)}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === STUDENT_STATUS_FILTER.ACTIVE ? 'default' : 'outline'}
            onClick={() => setFilter(STUDENT_STATUS_FILTER.ACTIVE)}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filter === STUDENT_STATUS_FILTER.INACTIVE ? 'default' : 'outline'}
            onClick={() => setFilter(STUDENT_STATUS_FILTER.INACTIVE)}
            size="sm"
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={handleEdit}
            onViewPayments={handleViewPayments}
          />
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No students found matching your criteria</p>
        </div>
      )}

      <AddStudentForm
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={createStudentMutation}
      />

      <EditStudentForm
        isOpen={isEditStudentOpen}
        onClose={() => {
          setIsEditStudentOpen(false);
          setEditingStudent(null);
        }}
        onUpdateStudent={updateStudentMutation}
        student={editingStudent}
      />

      <ViewPaymentsModal
        isOpen={isViewPaymentsOpen}
        onClose={() => setIsViewPaymentsOpen(false)}
        studentId={selectedStudentId}
        studentName={selectedStudentName}
        onMarkPaid={handleMarkPaid}
      />
    </div>
  );
}

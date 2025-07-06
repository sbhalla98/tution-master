'use client';
import AddStudentForm from '@/components/add-student-form';
import EditStudentForm from '@/components/edit-student-form';
import StudentCard from '@/components/student-card';
import ViewPaymentsModal from '@/components/view-payment-modal';
import { PAYMENT_STATUS } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { createStudent, markPaymentStatus, updateStudent } from '@/lib/api';
import { Student } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { STUDENT_STATUS_FILTER } from '../constants';
import { StudentStatusFilterType } from '../types';
import StudentsHeader from './students-header';
import StudentsSearchFilter from './students-search-filter';

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
    onSuccess: () => {
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
      (student.subjects ?? []).some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
      <StudentsHeader onAdd={() => setIsAddStudentOpen(true)} />
      <StudentsSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
      />

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

'use client';
import StudentCard from '@/components/cards/student-card';
import { EmptyState } from '@/components/illustration/empty-state';
import ViewPaymentsModal from '@/components/view-payment-modal';
import { PAYMENT_STATUS } from '@/constants';
import { STUDENT_STATUS_FILTER } from '@/constants/students';
import { useToast } from '@/hooks/use-toast';
import { markPaymentStatus } from '@/lib/api';
import { Student } from '@/types';
import { StudentStatusFilterType } from '@/types/students';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AddStudentContainer from './add-student-container';
import EditStudentContainer from './edit-student-container';
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
  const t = useTranslations('students');

  const { mutate: markPaymentStatusMutation } = useMutation({
    mutationFn: markPaymentStatus,
    onError: () => {
      toast({
        description: t('toast.payment.failed.description'),
        title: t('toast.payment.failed.title'),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        description: t('toast.payment.success.description'),
        title: t('toast.payment.success.title'),
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
        <EmptyState
          className="h-full text-gray-400 border-none shadow-none"
          icon={<Users className="h-12 w-12" />}
          title={t('empty.title')}
          description=""
        />
      )}

      <AddStudentContainer isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} />
      <EditStudentContainer
        isOpen={isEditStudentOpen}
        onClose={() => {
          setIsEditStudentOpen(false);
          setEditingStudent(null);
        }}
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

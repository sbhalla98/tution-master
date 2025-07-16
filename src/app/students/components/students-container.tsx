'use client';
import StudentCard from '@/components/cards/student-card';
import AddStudentContainer from '@/components/containers/add-student-container';
import { EmptyState } from '@/components/illustration/empty-state';
import { STUDENT_STATUS_FILTER } from '@/constants/students';
import { Student } from '@/types';
import { StudentStatusFilterType } from '@/types/students';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import EditStudentContainer from './edit-student-container';
import StudentsHeader from './students-header';
import StudentsSearchFilter from './students-search-filter';
import ViewPaymentsContainer from './view-payments-container';

type StudentsContainerProps = {
  students?: Student[] | null;
};

export default function StudentsContainer({ students }: StudentsContainerProps) {
  const t = useTranslations('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<StudentStatusFilterType>(STUDENT_STATUS_FILTER.ALL);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [isViewPaymentsOpen, setIsViewPaymentsOpen] = useState(false);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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

  const handleViewPayments = (student: Student) => {
    setSelectedStudent(student);
    setIsViewPaymentsOpen(true);
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
      <ViewPaymentsContainer
        isOpen={isViewPaymentsOpen}
        onClose={() => setIsViewPaymentsOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}

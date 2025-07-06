'use client';
import AddStudentForm from '@/components/AddStudentForm';
import EditStudentForm from '@/components/EditStudentForm';
import StudentCard from '@/components/StudentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ViewPaymentsModal from '@/components/ViewPaymentsModal';
import { PAYMENT_STATUS } from '@/constants';
import { createStudent, markPaymentStatus, updateStudent } from '@/lib/api';
import { Student } from '@/types';
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

  const handleAddStudent = async (newStudentData: Omit<Student, 'id'>) => {
    try {
      const newStudent = await createStudent(newStudentData);
      //   setStudents((prev) => [...prev, newStudent]);
      console.log('Added new student:', newStudent);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      const updated = await updateStudent(updatedStudent.id, updatedStudent);
      if (updated) {
        // setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        console.log('Updated student:', updated);
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleMarkPaid = async (paymentId: string) => {
    try {
      await markPaymentStatus(paymentId, PAYMENT_STATUS.PAID);
      console.log('Payment marked as paid:', paymentId);
    } catch (error) {
      console.error('Error marking payment as paid:', error);
    }
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
        onAddStudent={handleAddStudent}
      />

      <EditStudentForm
        isOpen={isEditStudentOpen}
        onClose={() => {
          setIsEditStudentOpen(false);
          setEditingStudent(null);
        }}
        onUpdateStudent={handleUpdateStudent}
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

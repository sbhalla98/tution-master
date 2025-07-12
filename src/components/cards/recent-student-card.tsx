import { Card, CardContent } from '@/components/ui/card';
import { Student } from '@/types';

type RecentStudentCardProps = {
  student: Student;
};

export default function RecentStudentCard({ student }: RecentStudentCardProps) {
  return (
    <Card>
      <CardContent className="p-3 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">{student.name}</p>
          <p className="text-sm text-gray-600">Subjects: {student.subjects?.join(', ') || 'N/A'}</p>
          <p className="text-sm text-gray-600">
            Joined: {new Date(student.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">₹{student.monthlyFee}</p>
        </div>
      </CardContent>
    </Card>
  );
}

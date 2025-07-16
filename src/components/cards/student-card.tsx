'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { STUDENT_STATUS } from '@/constants';
import { Student } from '@/types';
import { BookOpen, Calendar, Mail, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onViewPayments: (student: Student) => void;
}

export default function StudentCard({ student, onEdit, onViewPayments }: StudentCardProps) {
  const t = useTranslations('studentCard');
  const { name, monthlyFee, email, phone, subjects, grade, status, joinDate } = student;

  const statusColor =
    status === STUDENT_STATUS.ACTIVE
      ? 'bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-200/20 dark:text-red-400';

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <span
            className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
          >
            {t(`status.${status.toLowerCase()}`)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">₹{monthlyFee}</p>
          <p className="text-sm text-muted-foreground">{t('perMonth')}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          {email}
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          {phone}
        </div>
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          {(subjects ?? []).join(', ')} - {t('grade', { grade: grade ?? '' })}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {t('joined', { date: new Date(joinDate).toLocaleDateString() })}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(student)} className="flex-1">
          {t('edit')}
        </Button>
        <Button size="sm" onClick={() => onViewPayments(student)} className="flex-1">
          {t('viewPayments')}
        </Button>
      </CardFooter>
    </Card>
  );
}

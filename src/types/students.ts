import { STUDENT_STATUS_FILTER } from '@/app/students/constants';

export type StudentStatusFilterType =
  (typeof STUDENT_STATUS_FILTER)[keyof typeof STUDENT_STATUS_FILTER];

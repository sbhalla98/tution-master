import { STUDENT_STATUS_FILTER } from '@/constants/students';

export type StudentStatusFilterType =
  (typeof STUDENT_STATUS_FILTER)[keyof typeof STUDENT_STATUS_FILTER];

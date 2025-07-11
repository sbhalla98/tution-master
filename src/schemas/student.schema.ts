import { AVAILABLE_GRADES, AVAILABLE_SUBJECTS, STUDENT_STATUS } from '@/constants';
import { z } from 'zod';

export const createStudentSchema = z.object({
  email: z.string().email('Invalid email'),
  grade: z
    .enum([
      AVAILABLE_GRADES.SIXTH,
      AVAILABLE_GRADES.SEVENTH,
      AVAILABLE_GRADES.EIGHTH,
      AVAILABLE_GRADES.NINTH,
      AVAILABLE_GRADES.TENTH,
      AVAILABLE_GRADES.ELEVENTH,
      AVAILABLE_GRADES.TWELFTH,
    ])
    .nullable(),
  monthlyFee: z.coerce.number().min(0, 'Fee must be at least 0'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Phone number is too short'),
  status: z.enum([STUDENT_STATUS.ACTIVE, STUDENT_STATUS.INACTIVE]).default(STUDENT_STATUS.ACTIVE),
  subjects: z
    .array(
      z.enum([
        AVAILABLE_SUBJECTS.BIOLOGY,
        AVAILABLE_SUBJECTS.CHEMISTRY,
        AVAILABLE_SUBJECTS.ENGLISH,
        AVAILABLE_SUBJECTS.HISTORY,
        AVAILABLE_SUBJECTS.MATHEMATICS,
        AVAILABLE_SUBJECTS.PHYSICS,
      ])
    )
    .min(1, 'Select at least one subject')
    .nullable(),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

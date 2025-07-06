import { AVAILABLE_GRADES } from '@/constants';
import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is too short'),
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
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

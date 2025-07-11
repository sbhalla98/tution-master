export const PAYMENT_STATUS = {
  OVERDUE: 'OVERDUE',
  PAID: 'PAID',
  PENDING: 'PENDING',
} as const;

export const STUDENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const AVAILABLE_SUBJECTS = {
  BIOLOGY: 'Biology',
  CHEMISTRY: 'Chemistry',
  ENGLISH: 'English',
  HISTORY: 'History',
  MATHEMATICS: 'Mathematics',
  PHYSICS: 'Physics',
} as const;

export const AVAILABLE_GRADES = {
  EIGHTH: '8',
  ELEVENTH: '11',
  NINTH: '9',
  SEVENTH: '7',
  SIXTH: '6',
  TENTH: '10',
  TWELFTH: '12',
} as const;

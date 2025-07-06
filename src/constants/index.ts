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
  MATHEMATICS: 'Mathematics',
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  BIOLOGY: 'Biology',
  ENGLISH: 'English',
  HISTORY: 'History',
} as const;

export const AVAILABLE_GRADES = {
  SIXTH: '6',
  SEVENTH: '7',
  EIGHTH: '8',
  NINTH: '9',
  TENTH: '10',
  ELEVENTH: '11',
  TWELFTH: '12',
} as const;

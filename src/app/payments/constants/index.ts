import { PAYMENT_STATUS } from '@/constants';

export const PAYMENT_STATUS_FILTER = {
  ...PAYMENT_STATUS,
  ALL: 'ALL',
} as const;

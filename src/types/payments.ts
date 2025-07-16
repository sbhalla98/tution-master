import { PAYMENT_STATUS_FILTER } from '@/constants/payments';

export type PaymentStatusFilterType =
  (typeof PAYMENT_STATUS_FILTER)[keyof typeof PAYMENT_STATUS_FILTER];

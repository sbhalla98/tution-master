import { getPayments } from '@/lib/api';
import PaymentsContainer from './components/payments-container';

export default async function Payments() {
  const paymentsData = await getPayments();

  return <PaymentsContainer payments={paymentsData.data} />;
}

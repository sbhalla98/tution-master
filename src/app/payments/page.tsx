import { getPayments, getStudents } from '@/lib/api';
import PaymentsContainer from './components/payments-container';

export default async function Payments() {
  const [studentsData, paymentsData] = await Promise.all([getStudents(), getPayments()]);

  return <PaymentsContainer students={studentsData.data} payments={paymentsData.data} />;
}

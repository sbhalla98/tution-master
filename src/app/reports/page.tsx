import { getPayments, getStudents } from '@/lib/api';
import ReportsContainer from './components/reports-container';

export default async function Students() {
  const [studentsData, paymentsData] = await Promise.all([getStudents(), getPayments()]);

  return <ReportsContainer students={studentsData.data} payments={paymentsData.data} />;
}

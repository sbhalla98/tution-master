import { getPayments, getStudents } from '@/lib/api';
import DashboardContainer from './components/dashboard-container';

export default async function Dashboard() {
  const [studentsData, paymentsData] = await Promise.all([getStudents(), getPayments()]);

  return <DashboardContainer students={studentsData.data} payments={paymentsData.data} />;
}

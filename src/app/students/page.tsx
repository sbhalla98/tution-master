import { getStudents } from '@/lib/api';
import StudentsContainer from './components/students-container';

export default async function Dashboard() {
  const studentsData = await getStudents();

  return <StudentsContainer students={studentsData.data} />;
}

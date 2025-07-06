import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Props = {
  onAdd: () => void;
};

export default function StudentsHeader({ onAdd }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-1">Manage your student records</p>
      </div>
      <Button className="flex items-center gap-2" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Add Student
      </Button>
    </div>
  );
}

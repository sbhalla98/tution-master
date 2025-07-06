import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Props = {
  onAdd: () => void;
};

export default function StudentsHeader({ onAdd }: Props) {
  return (
    <Header title="Students" description="Manage your student records">
      <Button className="flex items-center gap-2" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Add Student
      </Button>
    </Header>
  );
}

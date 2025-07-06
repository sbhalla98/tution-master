import { SidebarTrigger } from './ui/sidebar';

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function Header({ title, description, children }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

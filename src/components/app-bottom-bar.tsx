import { NAVIGATION_ITEMS } from '@/constants/navigation';
import Link from 'next/link';
import { BottomBar } from './ui/bottom-bar';
import { Button } from './ui/button';

export default function AppBottomBar() {
  return (
    <BottomBar position="fixed" className="sm:hidden">
      <div className="flex items-center justify-between w-full ">
        {NAVIGATION_ITEMS.map(({ title, url, icon: Icon }) => (
          <Button variant="ghost" size="icon" className="size-10" asChild title={title} key={title}>
            <Link href={url} className="flex items-center gap-2">
              <Icon style={{ height: 24, width: 24 }} />
            </Link>
          </Button>
        ))}
      </div>
    </BottomBar>
  );
}

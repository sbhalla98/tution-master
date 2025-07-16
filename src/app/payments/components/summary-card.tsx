import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const VARIANTS = {
  DEFAULT: 'DEFAULT',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
} as const;

type SummaryCardProps = {
  title: string;
  content: string;
  variant: (typeof VARIANTS)[keyof typeof VARIANTS];
};

export default function SummaryCard({
  title,
  content,
  variant = VARIANTS.DEFAULT,
}: SummaryCardProps) {
  const config = {
    [VARIANTS.DEFAULT]: {
      cardClassName: 'bg-yellow-50 border-yellow-200',
      cardContentClassName: 'text-yellow-900',
      cardHeaderClassName: 'text-yellow-700',
    },
    [VARIANTS.ERROR]: {
      cardClassName: 'bg-red-50 border-red-200',
      cardContentClassName: 'text-red-900',
      cardHeaderClassName: 'text-red-700',
    },
    [VARIANTS.SUCCESS]: {
      cardClassName: 'bg-green-50 border-green-200',
      cardContentClassName: 'text-green-900',
      cardHeaderClassName: 'text-green-700',
    },
  };

  const { cardClassName, cardHeaderClassName, cardContentClassName } =
    config[variant] ?? config[VARIANTS.DEFAULT];

  return (
    <Card className={cn(cardClassName)}>
      <CardHeader className={cn('pb-0 text-sm font-medium', cardHeaderClassName)}>
        {title}
      </CardHeader>
      <CardContent className={cn('text-2xl font-bold', cardContentClassName)}>
        {content}
      </CardContent>
    </Card>
  );
}

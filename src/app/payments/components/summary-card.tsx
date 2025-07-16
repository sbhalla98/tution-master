import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const VARIANTS = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  DEFAULT: 'DEFAULT',
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
      cardHeaderClassName: 'text-yellow-700',
      cardContentClassName: 'text-yellow-900',
    },
    [VARIANTS.ERROR]: {
      cardClassName: 'bg-red-50 border-red-200',
      cardHeaderClassName: 'text-red-700',
      cardContentClassName: 'text-red-900',
    },
    [VARIANTS.SUCCESS]: {
      cardClassName: 'bg-green-50 border-green-200',
      cardHeaderClassName: 'text-green-700',
      cardContentClassName: 'text-green-900',
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

import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';

export const KeyChip: FC<{ label: string; className?: string }> = ({
  label,
  className,
}) => (
  <Badge
    variant="outline"
    className={[
      'px-1.5 py-0.5 text-[10px] sm:text-xs font-mono tracking-tight',
      className ?? '',
    ].join(' ')}
    aria-label={`Shortcut key ${label}`}
  >
    {label}
  </Badge>
);

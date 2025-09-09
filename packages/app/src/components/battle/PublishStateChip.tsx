import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { publishStateKeys } from '@yonokomae/data-battle-seeds';

export type PublishStateChipProps = {
  state: string; // constrained at runtime via lookup in publishStateKeys
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'accent' | 'ring';
  showLabel?: boolean; // show text label (default true)
};

// Icon mapping (simple emoji set; adjust later if design system adds real icons)
const STATE_ICONS: Record<string, string> = {
  published: '📝',
  draft: '✏️',
  review: '🕵️',
  archived: '📦',
};

type PublishStateKey = (typeof publishStateKeys)[number];

function isPublishStateKey(s: string): s is PublishStateKey {
  return (publishStateKeys as readonly string[]).includes(s);
}

function resolveState(state: string): PublishStateKey {
  return isPublishStateKey(state) ? state : publishStateKeys[0];
}

export const PublishStateChip: FC<PublishStateChipProps> = ({
  state,
  className,
  variant = 'secondary',
  showLabel = true,
}) => {
  const resolved = resolveState(state);
  const icon = STATE_ICONS[resolved] || 'ℹ️';
  const label = resolved;

  return (
    <Badge
      variant={variant}
      className={[
        'px-2.5 py-0.5 text-[10px] sm:text-xs gap-1',
        'inline-flex items-center font-medium tracking-tight',
        className ?? '',
      ].join(' ')}
      aria-label={`Publish State ${label}`}
      title={label}
      data-testid="publish-state-chip"
    >
      <span aria-hidden>{icon}</span>
      {showLabel ? <span>{label}</span> : null}
    </Badge>
  );
};

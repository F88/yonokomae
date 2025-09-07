import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { battleThemeCatalog } from '@yonokomae/catalog';
import type { Battle } from '@yonokomae/types';

export type ThemeChipProps = {
  themeId: Battle['themeId'];
  className?: string;
  variant?: 'default' | 'secondary' | 'outline';
  showName?: boolean;
};

function resolveTheme(themeId: Battle['themeId']) {
  return (
    battleThemeCatalog.find((t) => t.id === themeId) ?? battleThemeCatalog[0]
  );
}

export const ThemeChip: FC<ThemeChipProps> = ({
  themeId,
  className,
  variant = 'secondary',
  showName = true,
}) => {
  const theme = resolveTheme(themeId);

  return (
    <Badge
      variant={variant}
      className={[
        'px-2.5 py-0.5 text-[10px] sm:text-xs gap-1',
        'inline-flex items-center font-medium tracking-tight',
        className ?? '',
      ].join(' ')}
      aria-label={`Theme ${theme.name}`}
      title={theme.description}
      data-testid="theme-chip"
    >
      <span aria-hidden>{theme.icon}</span>
      {showName ? <span>{theme.name}</span> : null}
    </Badge>
  );
};

export default ThemeChip;

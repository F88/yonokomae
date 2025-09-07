import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { battleSeedsByFile } from '@yonokomae/data-battle-seeds';
import { battleThemeCatalog } from '@yonokomae/catalog';

export interface BattleTitleChipProps {
  /** Battle seed file (key in battleSeedsByFile) */
  file: string | undefined;
  /** Badge variant */
  variant?: 'default' | 'secondary' | 'outline';
  /** Optional extra class names */
  className?: string;
  /** If true, show raw file when title missing (default true). */
  fallbackToFileName?: boolean;
  /** Custom placeholder when not found */
  notFoundLabel?: string;
  /** Truncate long titles (default true) */
  truncate?: boolean;
  /** Show theme icon before title (default false to preserve legacy text expectations) */
  showThemeIcon?: boolean;
}

interface BattleShapeLike {
  title?: string;
  themeId?: string;
}

function resolveTitle(
  file: string | undefined,
  opts: { fallbackToFileName: boolean; notFoundLabel: string },
) {
  if (!file) return opts.notFoundLabel;
  const battle = (
    battleSeedsByFile as Record<string, BattleShapeLike | undefined>
  )[file];
  if (battle && battle.title) return battle.title;
  if (battle && !battle.title && opts.fallbackToFileName) return file;
  if (!battle && opts.fallbackToFileName) return file;
  return opts.notFoundLabel;
}

export const BattleTitleChip: FC<BattleTitleChipProps> = ({
  file,
  variant = 'secondary',
  className,
  fallbackToFileName = true,
  notFoundLabel = 'Unknown Battle',
  truncate = true,
  showThemeIcon = false,
}) => {
  const battle = file
    ? (battleSeedsByFile as Record<string, BattleShapeLike | undefined>)[file]
    : undefined;
  const title = resolveTitle(file, { fallbackToFileName, notFoundLabel });
  const themeIcon = (() => {
    if (!showThemeIcon || !battle || !battle.themeId) return undefined;
    const theme = battleThemeCatalog.find((t) => t.id === battle.themeId);
    return theme?.icon;
  })();
  return (
    <Badge
      variant={variant}
      title={title}
      data-testid="battle-title-chip"
      className={[
        'px-1.5 py-0.5 text-[10px] sm:text-xs gap-1 inline-flex items-center font-medium tracking-tight',
        truncate ? 'max-w-[220px] sm:max-w-[320px] truncate' : '',
        className ?? '',
      ].join(' ')}
    >
      {themeIcon ? (
        <span aria-hidden data-testid="battle-title-chip-theme-icon">
          {themeIcon}
        </span>
      ) : null}
      <span>{title}</span>
    </Badge>
  );
};

export default BattleTitleChip;

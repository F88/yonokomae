import React from 'react';
import { render } from '@testing-library/react';
import type { PlayMode } from '@/yk/play-mode';
import { RepositoryProvider } from '@/yk/repo/core/RepositoryProvider';

export function renderWithProviders(
  ui: React.ReactElement,
  options?: { mode?: PlayMode },
) {
  const { mode } = options ?? {};
  return render(<RepositoryProvider mode={mode}>{ui}</RepositoryProvider>);
}

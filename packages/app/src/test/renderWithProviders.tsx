import React from 'react';
import { render, type RenderResult } from '@testing-library/react';
import type { PlayMode } from '@/yk/play-mode';
import { RepositoryProvider } from '@/yk/repo/core/RepositoryProvider';

export function renderWithProviders(
  ui: React.ReactElement,
  options?: { mode?: PlayMode },
): RenderResult {
  const { mode } = options ?? {};
  return render(<RepositoryProvider mode={mode}>{ui}</RepositoryProvider>);
}

import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Battle } from '@yonokomae/types';

// Mock uid to return an empty string so the placeholder battle gets a falsy id
vi.mock('@/lib/id', () => ({
  uid: () => '',
}));

// Mock the generate report hook to avoid dynamic imports and delays
import type { GenerateBattleReportParams } from '@/yk/repo/core/repositories';
const mockGenerateReport =
  vi.fn<(params?: GenerateBattleReportParams) => Promise<Battle>>();
vi.mock('@/hooks/use-generate-report', () => ({
  useGenerateReport: () => ({
    generateReport: mockGenerateReport,
  }),
}));

import App from './App';

describe('App - defensive guard for invalid battle.id (lines 336-337)', () => {
  beforeEach(() => {
    mockGenerateReport.mockReset();
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
  });

  it('skips rendering a battle when its id is falsy (covers guard)', async () => {
    // Keep the loading placeholder in the list (never resolve) so the guard executes during rendering.
    mockGenerateReport.mockImplementationOnce(
      async () => new Promise<Battle>(() => {}),
    );

    render(<App />);

    // Enter to select the default mode on the title screen
    const radioGroup = screen.getByRole('radiogroup', { name: 'Play modes' });
    radioGroup.focus();
    await userEvent.keyboard('{Enter}');

    // Click Battle
    const battleBtn = await screen.findByRole('button', { name: /battle/i });
    await userEvent.click(battleBtn);

    // generateReport was called (but never resolves)
    await waitFor(() => expect(mockGenerateReport).toHaveBeenCalledTimes(1));

    // Because placeholder id is "", the defensive guard should prevent rendering
    // of the loading card itself.
    expect(screen.queryByText('Writing report...')).not.toBeInTheDocument();
  });
});

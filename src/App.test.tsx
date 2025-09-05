import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { playMode } from '@/yk/play-mode';
import type { Battle } from '@yonokomae/types';

// Mock the generate report hook to avoid dynamic imports and delays
const mockGenerateReport = vi.fn<() => Promise<Battle>>();
vi.mock('@/hooks/use-generate-report', () => ({
  useGenerateReport: () => ({
    generateReport: mockGenerateReport,
  }),
}));

beforeEach(() => {
  mockGenerateReport.mockReset();
  // jsdom doesn't implement scrollTo; provide a noop mock

  (window as any).scrollTo = vi.fn();
});

async function setupWithModeSelected() {
  const utils = render(<App />);
  // Focus the radiogroup and press Enter to confirm the default (first enabled) option
  const radioGroup = screen.getByRole('radiogroup', { name: 'Play modes' });
  radioGroup.focus();
  await userEvent.keyboard('{Enter}');
  // Wait until title screen disappears
  await waitFor(() => {
    expect(screen.queryByText('SELECT MODE')).not.toBeInTheDocument();
  });
  return utils;
}

describe('App', () => {
  it('renders title screen initially (no controller)', () => {
    render(<App />);
    expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    const firstEnabled = playMode.find((m) => m.enabled === true)!;
    expect(screen.getByText(firstEnabled.title)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /battle/i }),
    ).not.toBeInTheDocument();
  });

  it('selects a mode and shows controller and header badge', async () => {
    render(<App />);
    const radioGroup = screen.getByRole('radiogroup', { name: 'Play modes' });
    radioGroup.focus();
    await userEvent.keyboard('{Enter}');

    // Title screen disappears
    await waitFor(() => {
      expect(screen.queryByText('SELECT MODE')).not.toBeInTheDocument();
    });

    // Controller appears
    expect(screen.getByRole('button', { name: /battle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();

    // Header mode badge (uses aria-label="Mode: <title>")
    const firstEnabled = playMode.find((m) => m.enabled === true)!;
    expect(
      screen.getByLabelText(`Mode: ${firstEnabled.title}`),
    ).toBeInTheDocument();
  });

  it('clicking Battle calls generateReport and renders the result', async () => {
    const mockBattle: Battle = {
      id: 'battle_1',
      themeId: 'history',
      significance: 'low',
      title: 'Mock Battle',
      subtitle: 'Sub',
      narrative: { overview: 'Overview', scenario: 'Scenario' },
      komae: {
        imageUrl: '',
        title: 'Komae',
        subtitle: '',
        description: '',
        power: 1,
      },
      yono: {
        imageUrl: '',
        title: 'Yono',
        subtitle: '',
        description: '',
        power: 2,
      },
      status: 'success',
    };
    mockGenerateReport.mockResolvedValueOnce(mockBattle);

    await setupWithModeSelected();

    const battleButton = await screen.findByRole('button', { name: /battle/i });
    await userEvent.click(battleButton);

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledTimes(1);
    });

    // Loading placeholder title appears then replaced by final battle title
    await screen.findByRole('heading', { name: /mock battle/i });
  });

  it('Reset clears reports and returns to title screen', async () => {
    mockGenerateReport.mockResolvedValueOnce({
      id: 'battle_2',
      themeId: 'history',
      significance: 'low',
      title: 'Another Battle',
      subtitle: 'Sub',
      narrative: { overview: 'Overview', scenario: 'Scenario' },
      komae: {
        imageUrl: '',
        title: 'Komae',
        subtitle: '',
        description: '',
        power: 1,
      },
      yono: {
        imageUrl: '',
        title: 'Yono',
        subtitle: '',
        description: '',
        power: 2,
      },
      status: 'success',
    });

    await setupWithModeSelected();

    const battleButton = await screen.findByRole('button', { name: /battle/i });
    await userEvent.click(battleButton);
    await screen.findByRole('heading', { name: /another battle/i });

    await userEvent.click(screen.getByRole('button', { name: /reset/i }));

    await waitFor(() => {
      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /battle/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('supports controller keyboard shortcuts (B for battle, R for reset)', async () => {
    mockGenerateReport.mockResolvedValue({
      id: 'battle_k',
      themeId: 'history',
      significance: 'low',
      title: 'KB Battle',
      subtitle: 'Sub',
      narrative: { overview: 'Overview', scenario: 'Scenario' },
      komae: {
        imageUrl: '',
        title: 'Komae',
        subtitle: '',
        description: '',
        power: 1,
      },
      yono: {
        imageUrl: '',
        title: 'Yono',
        subtitle: '',
        description: '',
        power: 2,
      },
      status: 'success',
    });

    await setupWithModeSelected();

    // Press 'b' to battle
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    });
    await screen.findByRole('heading', { name: /kb battle/i });
    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledTimes(1);
    });

    // Press 'r' to reset
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
    });
    await waitFor(() => {
      expect(screen.getByText('SELECT MODE')).toBeInTheDocument();
    });
  });
});

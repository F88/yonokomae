import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Spy generate report to avoid real repo latency
const mockGenerateReport = vi.fn();
vi.mock('@/hooks/use-generate-report', () => ({
  useGenerateReport: () => ({ generateReport: mockGenerateReport }),
}));

beforeEach(() => {
  mockGenerateReport.mockReset();
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
});

describe('App play mode selection: yk-now', () => {
  it("selecting 'yk-now' reflects correct header badge (not demo)", async () => {
    render(<App />);
    // Click the text node inside the label
    const ykNowText = await screen.findByText('よのこまライブ');
    await userEvent.click(ykNowText);

    await waitFor(() => {
      expect(screen.queryByText('SELECT MODE')).not.toBeInTheDocument();
    });

    const badge = screen.getByLabelText(/Mode:/);
    expect(badge).toHaveTextContent('よのこまライブ');
    expect(badge).not.toHaveTextContent('デモ (ja)');
  });
});

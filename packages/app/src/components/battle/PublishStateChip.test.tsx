import { describe, it, expect, vi } from 'vitest';
/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { PublishStateChip } from './PublishStateChip';

vi.mock('@yonokomae/data-battle-seeds', () => ({
  publishStateKeys: ['published', 'draft', 'review', 'archived'],
}));

describe('PublishStateChip', () => {
  it('renders published state with icon and label', () => {
    render(<PublishStateChip state="published" />);
    const chip = screen.getByTestId('publish-state-chip');
    expect(chip).toBeInTheDocument();
    expect(screen.getByText('published')).toBeInTheDocument();
    // Icon presence (aria-hidden span inside)
    const iconSpan = chip.querySelector('span[aria-hidden="true"]');
    expect(iconSpan).not.toBeNull();
  });

  it('renders other known states', () => {
    const states = ['draft', 'review', 'archived'] as const;
    states.forEach((s) => {
      const { unmount } = render(<PublishStateChip state={s} />);
      const chips = screen.getAllByTestId('publish-state-chip');
      expect(chips.length).toBeGreaterThan(0);
      expect(screen.getAllByText(s).length).toBeGreaterThan(0);
      unmount();
    });
  });

  it('falls back to first key for unknown state', () => {
    render(<PublishStateChip state="unknown" />);
    // Fallback is the first mocked key => published (assert at least one)
    expect(screen.getAllByText('published').length).toBeGreaterThan(0);
  });

  it('hides label when showLabel is false', () => {
    render(<PublishStateChip state="draft" showLabel={false} />);
    // There should still be a chip but no text node with 'draft'
    const chips = screen.getAllByTestId('publish-state-chip');
    expect(chips.length).toBeGreaterThan(0);
    // Ensure no text node equals 'draft'
    const draftTexts = screen.queryAllByText('draft');
    expect(draftTexts.length).toBe(0);
  });

  it('has accessible attributes', () => {
    render(<PublishStateChip state="review" />);
    const chip = screen.getByLabelText('Publish State review');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('title', 'review');
  });
});

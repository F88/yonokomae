import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SignificanceChip } from './SignificanceChip';

describe('SignificanceChip', () => {
  it('renders with correct significance level and icon', () => {
    render(<SignificanceChip significance="high" />);

    const chip = screen.getByTestId('significance-chip');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveTextContent('🎖️');
    expect(chip).toHaveAttribute('title', 'high');
    expect(chip).toHaveAttribute('aria-label', 'Significance high');
  });

  it('renders all significance levels with correct icons', () => {
    const levels: Array<{
      level: 'low' | 'medium' | 'high' | 'legendary';
      icon: string;
    }> = [
      { level: 'low', icon: '•' },
      { level: 'medium', icon: '▲' },
      { level: 'high', icon: '🎖️' },
      { level: 'legendary', icon: '⭐' },
    ];

    levels.forEach(({ level, icon }) => {
      const { rerender } = render(<SignificanceChip significance={level} />);

      const chip = screen.getByTestId('significance-chip');
      expect(chip).toHaveTextContent(icon);
      expect(chip).toHaveAttribute('title', level);

      rerender(<></>);
    });
  });

  it('shows label when showLabel is true', () => {
    render(<SignificanceChip significance="medium" showLabel={true} />);

    const chip = screen.getByTestId('significance-chip');
    expect(chip).toHaveTextContent('▲');
    expect(chip).toHaveTextContent('medium');
    // Check that the label span has uppercase class
    const labelSpan = chip.querySelector('span.uppercase');
    expect(labelSpan).toBeInTheDocument();
  });

  it('does not show label when showLabel is false or undefined', () => {
    render(<SignificanceChip significance="medium" showLabel={false} />);

    const chip = screen.getByTestId('significance-chip');
    expect(chip).toHaveTextContent('▲');
    // Check that the label span is not present
    const labelSpan = chip.querySelector('span.uppercase');
    expect(labelSpan).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SignificanceChip significance="low" className="custom-class" />);

    const chip = screen.getByTestId('significance-chip');
    expect(chip).toHaveClass('custom-class');
  });

  it('applies correct variant', () => {
    render(<SignificanceChip significance="high" variant="outline" />);

    const chip = screen.getByTestId('significance-chip');
    expect(chip).toBeInTheDocument();
  });

  it('applies significance-specific color classes', () => {
    render(<SignificanceChip significance="legendary" />);

    const chip = screen.getByTestId('significance-chip');
    expect(chip).toHaveClass('bg-fuchsia-100', 'text-fuchsia-800');
  });
});

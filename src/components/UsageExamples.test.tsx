import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UsageExamples } from './UsageExamples';

describe('UsageExamples', () => {
  it('renders usage examples', () => {
    render(<UsageExamples />);
    expect(screen.getByLabelText('Usage examples marquee')).toBeInTheDocument();
  });

  it('renders with custom aria label', () => {
    render(<UsageExamples ariaLabel="Custom usage examples" />);
    expect(screen.getByLabelText('Custom usage examples')).toBeInTheDocument();
  });
});

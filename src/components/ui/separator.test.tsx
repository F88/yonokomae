import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders with default props', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-slot', 'separator');
  });

  it('has horizontal orientation by default', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('is decorative by default', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'none');
  });

  it('applies correct classes for horizontal orientation', () => {
    render(<Separator orientation="horizontal" data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('bg-border', 'shrink-0');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('applies correct classes for vertical orientation', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('bg-border', 'shrink-0');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('applies custom className', () => {
    render(
      <Separator className="custom-separator-class" data-testid="separator" />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('custom-separator-class');
    // Should still have default classes
    expect(separator).toHaveClass('bg-border', 'shrink-0');
  });

  it('can be non-decorative', () => {
    render(
      <Separator
        decorative={false}
        data-testid="separator"
        aria-label="Content separator"
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).not.toHaveAttribute('role', 'none');
    expect(separator).toHaveAttribute('aria-label', 'Content separator');
  });

  it('passes through other props', () => {
    render(
      <Separator
        data-testid="separator"
        style={{ margin: '10px' }}
        title="Separator element"
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveStyle({ margin: '10px' });
    expect(separator).toHaveAttribute('title', 'Separator element');
  });

  it('has proper data attributes for CSS targeting', () => {
    const { rerender } = render(
      <Separator orientation="horizontal" data-testid="separator" />,
    );

    let separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');

    rerender(<Separator orientation="vertical" data-testid="separator" />);

    separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('supports accessibility attributes', () => {
    render(
      <Separator
        decorative={false}
        data-testid="separator"
        role="separator"
        aria-orientation="horizontal"
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders correctly in a layout context', () => {
    render(
      <div>
        <div>Content above</div>
        <Separator data-testid="separator" />
        <div>Content below</div>
      </div>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();

    const contentAbove = screen.getByText('Content above');
    const contentBelow = screen.getByText('Content below');

    expect(contentAbove).toBeInTheDocument();
    expect(contentBelow).toBeInTheDocument();
  });

  it('handles different styling contexts', () => {
    const { rerender } = render(
      <Separator className="my-4 bg-red-500" data-testid="separator" />,
    );

    let separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('my-4', 'bg-red-500');

    // Test with different styling
    rerender(
      <Separator className="mx-8 bg-blue-300 h-0.5" data-testid="separator" />,
    );

    separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('mx-8', 'bg-blue-300', 'h-0.5');
  });
});

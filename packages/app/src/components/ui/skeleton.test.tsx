import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders as a div element', () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.tagName).toBe('DIV');
  });

  it('applies default skeleton classes', () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('applies custom className', () => {
    render(
      <Skeleton className="custom-skeleton-class" data-testid="skeleton" />,
    );

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('custom-skeleton-class');
    // Should still have default classes
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('accepts and passes through div props', () => {
    render(
      <Skeleton
        data-testid="skeleton"
        style={{ width: '100px', height: '20px' }}
        aria-label="Loading content"
        role="status"
      />,
    );

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '100px', height: '20px' });
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    expect(skeleton).toHaveAttribute('role', 'status');
  });

  it('renders with specific dimensions', () => {
    render(<Skeleton className="w-48 h-4" data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('w-48', 'h-4');
  });

  it('can be used for text placeholder', () => {
    render(<Skeleton className="h-4 w-[250px]" data-testid="text-skeleton" />);

    const skeleton = screen.getByTestId('text-skeleton');
    expect(skeleton).toHaveClass('h-4', 'w-[250px]');
  });

  it('can be used for circular placeholder', () => {
    render(
      <Skeleton
        className="h-12 w-12 rounded-full"
        data-testid="circular-skeleton"
      />,
    );

    const skeleton = screen.getByTestId('circular-skeleton');
    expect(skeleton).toHaveClass('h-12', 'w-12', 'rounded-full');
    // Should override the default rounded-md with rounded-full
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('can be used for card placeholder', () => {
    render(
      <div>
        <Skeleton
          className="h-[125px] w-[250px] rounded-xl"
          data-testid="card-skeleton"
        />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" data-testid="title-skeleton" />
          <Skeleton
            className="h-4 w-[200px]"
            data-testid="description-skeleton"
          />
        </div>
      </div>,
    );

    const cardSkeleton = screen.getByTestId('card-skeleton');
    const titleSkeleton = screen.getByTestId('title-skeleton');
    const descriptionSkeleton = screen.getByTestId('description-skeleton');

    expect(cardSkeleton).toHaveClass('h-[125px]', 'w-[250px]', 'rounded-xl');
    expect(titleSkeleton).toHaveClass('h-4', 'w-[250px]');
    expect(descriptionSkeleton).toHaveClass('h-4', 'w-[200px]');
  });

  it('handles empty props gracefully', () => {
    render(<Skeleton data-testid="minimal-skeleton" />);

    const skeleton = screen.getByTestId('minimal-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('merges multiple custom classes correctly', () => {
    render(
      <Skeleton
        className="w-full h-20 rounded-lg bg-gray-200"
        data-testid="multi-class-skeleton"
      />,
    );

    const skeleton = screen.getByTestId('multi-class-skeleton');
    expect(skeleton).toHaveClass('w-full', 'h-20', 'rounded-lg', 'bg-gray-200');
    // Should still have default animation
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('supports accessibility attributes', () => {
    render(
      <Skeleton
        data-testid="accessible-skeleton"
        aria-busy="true"
        aria-live="polite"
        role="status"
      />,
    );

    const skeleton = screen.getByTestId('accessible-skeleton');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(skeleton).toHaveAttribute('aria-live', 'polite');
    expect(skeleton).toHaveAttribute('role', 'status');
  });
});
